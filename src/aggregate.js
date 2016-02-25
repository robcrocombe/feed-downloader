import database from './database';
import User from './database/models/user';
import log from './log';
import settle from 'promise-settle';
import request from './http/request';
import requestIfModifiedSince from './http/if-modified-since-request';

function getUsersFeedAndUpdateLastModified(user) {
  return new Promise((resolve, reject) => {
    const req = (user.feedLastModified ?
                 requestIfModifiedSince(user.blogFeedURI, user.feedLastModified) : request(user.blogFeedURI));

    req.then(result => {
      if (result.modified && result.modified === false) {
        resolve(null);
      } else {
        log.info('gonna update db');
        User.update({ feedLastModified: result.lastModified }, { where: { id: user.id } })
          .then(() => {
            log.info('updated db');
            resolve(result.data);
          })
          .catch(exception => {
            log.error({ exception }, 'fuck');
          });
      }
    })
    .catch(exception => {
      log.error({ exception }, 'Error getting user feed / persisting new feedLastModified date');
      reject();
    });
  });
}

function getAllFeedsWithNewPosts(users) {
  return new Promise(resolve => {
    const usersFeedsIfModified = users.map(user => getUsersFeedAndUpdateLastModified(user));
    settle(usersFeedsIfModified).then(promiseResults => {
      const successfulRequests = promiseResults.filter(result => result.isFulfilled());
      const newFeeds = successfulRequests.map(successfulRequest => successfulRequest.value());
      resolve(newFeeds);
    });
  });
}

export default function aggregate() {
  return new Promise((resolve, reject) => {
    database.sync()
      .then(() =>
        User.findAll({
          attributes: ['id', 'authentication_provider', 'firstName', 'lastName', 'blogFeedURI']
        }))
      .then(users => {
        log.info({ users }, 'Users loaded from database');
        return users;
      })
      .then(users => getAllFeedsWithNewPosts(users))
      .then(feedsWithNewPosts => {
        log.info({ feedsWithNewPosts }, 'Here are the feeds with new posts');
      })
      .then(resolve)
      .catch(reject);
  });
}

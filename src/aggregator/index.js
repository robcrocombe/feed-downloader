import database from '../database';
import User from '../database/models/user';
import log from '../log';
import getNewPosts from './get-users-new-posts';
import settle from 'promise-settle';

function collateUpdateInformation(getNewPostResults) {
  const newAndModifiedBlogMetadata = [];
  getNewPostResults.forEach(result => {
    if (result.isFulfilled()) {
      const postMetadata = result.value();
      if (postMetadata) {
        newAndModifiedBlogMetadata.push(result.value());
      }
    } else {
      log.warn({ error: result.reason() }, 'getUsersNewPost promise was rejected');
    }
  });
  return newAndModifiedBlogMetadata;
}

export default function aggregate() {
  return new Promise((resolve, reject) => {
    database.sync()
      .then(() => {
        const users = User.findAll({
          attributes: ['id', 'authenticationProvider', 'firstName', 'lastName', 'blogFeedURI']
        });
        log.info({ users }, 'Users loaded from database');
        return users;
      })
      .then(users => {
        const getUsersNewPostsPromises = users.map(user => getNewPosts(user));
        return settle(getUsersNewPostsPromises);
      })
      .then(collateUpdateInformation)
      .then(resolve)
      .catch(reject);
  });
}

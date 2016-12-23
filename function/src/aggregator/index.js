import settle from 'promise-settle';
import database from '../database';
import User from '../database/models/user';
import BlogPost from '../database/models/blog-post';
import log from '../log';
import getNewPosts from './get-users-new-posts';

function collateUpdateInformation(getNewPostResults) {
  const newAndModifiedBlogMetadata = [];
  getNewPostResults.forEach((result) => {
    if (result.isFulfilled()) {
      const postMetadata = result.value();
      if (postMetadata) {
        newAndModifiedBlogMetadata.push(result.value());
      }
    } else {
      log.warn({ error: `${result.reason()}` }, 'getUsersNewPost promise was rejected');
    }
  });
  return newAndModifiedBlogMetadata;
}

export default function aggregate() {
  return new Promise((resolve, reject) => {
    database.sync()
      .then(() =>
        User.findAll({
          attributes: ['id', 'authenticationProvider', 'firstName', 'lastName', 'blogFeedURI'],
          where: { verified: true }
        })
      )
      .then((users) => {
        log.info({ users }, 'Users loaded from database');
        const getUsersNewPostsPromises = users.map(user => getNewPosts(user));
        return settle(getUsersNewPostsPromises);
      })
      .then(collateUpdateInformation)
      .then(updates =>
        database.transaction(transaction =>
          BlogPost.bulkCreate(updates.map(update => update.newPosts).reduce((a, b) => a.concat(b)), { transaction, validate: true })
          .then(() => {
            const authorUpdatePromises = updates.map(update => User.update({ feedLastModified: update.lastModifiedDate },
                                                                          { where: { id: update.author_id }, transaction }));
            return Promise.all(authorUpdatePromises);
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
}

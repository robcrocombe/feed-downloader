import database from '../database';
import User from '../database/models/user';
import log from '../log';
import getNewPosts from './get-users-new-posts';
import settle from 'promise-settle';

export default function aggregate() {
  return new Promise((resolve, reject) => {
    database.sync()
      .then(() =>
        User.findAll({
          attributes: ['id', 'authenticationProvider', 'firstName', 'lastName', 'blogFeedURI'],
          where: { verified: true }
        }))
      .then(users => {
        log.info({ users }, 'Users loaded from database');
        return users;
      })
      .then(users => {
        const getUsersNewPostsPromises = users.map(user => getNewPosts(user));
        log.info('Queued up %s get-users-new-posts promises', getUsersNewPostsPromises.length);
        // TODO: Make transaction so that lastModifiedDates are only updated if new posts added OK
        return settle(getUsersNewPostsPromises);
      })
      .then(resolve)
      .catch(reject);
  });
}

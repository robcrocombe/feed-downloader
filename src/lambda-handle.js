import log from './log';
import database from './database';
import User from './database/models/user';

export function handle(event, context) {
  log.info('CS Blogs Feed Aggregator Started');

  database.sync()
    .then(() =>
      User.findAll({
        attributes: ['id', 'blogFeedURI']
      }))
    .then(users => {
      users.forEach(user => {
        log.info({ user }, 'User loaded from database');
      });
    })
    .then(() => {
      // context.succeed() called so AWS knows function completed successfully
      context.succeed();
    })
    .catch(error => {
      // context.fail() to report error to AWS Lambda
      context.fail(error);
    });
}

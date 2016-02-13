import log from './log';
import database from './database';
import User from './database/models/user';

export function start() {
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
    });
}

export function awsLambdaHandle(event, context) {
  log.info({ event, context }, 'AWS Lamba Event Triggered Launch');
}

start();

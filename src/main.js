import log from './log';
import database from './database';
import User from './database/models/user';

log.info('CS Blogs Feed Aggregator Started');

database.sync().then(() => {
  User.findAll({
    attributes: ['id', 'blogFeedURI']
  }).then(users => {
    users.forEach(user => {
      log.info({ user }, 'User loaded from database');
    });
  });
});

import log from '../log';
import requestUserFeed from './request-user-feed';
import parseSyndicationFeed from './feed-parser';

export default function getUsersNewPosts(user) {
  return new Promise((resolve, reject) => {
    requestUserFeed(user)
      .then(result => {
        // Return null if not modified
        if (result === null) { resolve(null); } else { return result; }
      })
      .then(({ lastModified, data }) =>
        ({ lastModified, feed: parseSyndicationFeed(data) })
      )
      .then(({ lastModified, feed }) => {
        log.info({ user, lastModified, feed }, 'Parsed users feed');
      })
      .catch(reject);
  });
}

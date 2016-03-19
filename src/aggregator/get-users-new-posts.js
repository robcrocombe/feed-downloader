import log from '../log';
import requestUserFeed from './request-user-feed';
import parseSyndicationFeed from '../feed-parser';
import filterExistingPosts from './filter-existing-posts';

export default function getUsersNewPosts(user) {
  return new Promise((resolve, reject) => {
    let lastModifiedDate = null;

    requestUserFeed(user)
      .then(result => {
        // Resolve null if not modified
        if (result === null) { resolve(null); } else { return result; }
      })
      .then(({ lastModified, data }) => {
        lastModifiedDate = lastModified;
        return parseSyndicationFeed(data);
      })
      .then(blogPosts => {
        log.info({ user, lastModifiedDate, blogPosts }, 'Parsed users feed');
        return filterExistingPosts(blogPosts);
      })
      .then(() => resolve())
      .catch(reject);
  });
}

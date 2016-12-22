import log from '../log';
import requestUserFeed from './request-user-feed';
import parseSyndicationFeed from '../feed-parser';
import filterExistingPosts from './filter-existing-posts';

function addAuthorAndDates(post, userId) {
  const postWithUser = post;
  postWithUser.author_id = userId;
  if (!postWithUser.dateUpdated) {
    postWithUser.dateUpdated = postWithUser.datePublished;
  }
  if (!postWithUser.datePublished) {
    postWithUser.datePublished = postWithUser.dateUpdated;
  }
  return postWithUser;
}

export default function getUsersNewPosts(user) {
  return new Promise((resolve, reject) => {
    let lastModifiedDate = null;

    requestUserFeed(user)
      .then((result) => {
        // Resolve null if not modified
        if (result === null) {
          return resolve(null);
        }
        return result;
      })
      .then(({ lastModified, data }) => {
        lastModifiedDate = lastModified;
        return parseSyndicationFeed(data);
      })
      .then((blogPosts) => {
        log.info({ user, lastModifiedDate, blogPosts }, 'Parsed users feed');
        return filterExistingPosts(blogPosts, user.id);
      })
      .then(({ newPosts, modifiedPosts }) => {
        if (newPosts.length === 0 && modifiedPosts.length === 0) {
          resolve(null);
        } else {
          newPosts.map(post => addAuthorAndDates(post, user.id));
          modifiedPosts.map(post => addAuthorAndDates(post, user.id));

          log.info({ newPosts, modifiedPosts }, 'Found new or modified posts');
          resolve({ author_id: user.id, newPosts, modifiedPosts, lastModifiedDate });
        }
      })
      .then(() => resolve())
      .catch(reject);
  });
}

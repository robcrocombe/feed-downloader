import request from '../http/request';
import requestIfModifiedSince from '../http/if-modified-since-request';

export default function requestUserFeed(user) {
  return new Promise((resolve, reject) => {
    const req = user.feedLastModified ? requestIfModifiedSince(user.blogFeedURI, user.feedLastModified) : request(user.blogFeedURI);
    req.then((result) => {
      result.modified && result.modified === false ? resolve(null) : resolve(result);
    }).catch((exception) => {
      reject(exception);
    });
  });
}

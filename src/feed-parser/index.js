import check from 'check-types';

export default function parseSyndicationFeed(feedString) {
  return new Promise((resolve, reject) => {
    if (!check.nonEmptyString(feedString)) {
      reject(new Error('Valid RSS/ATOM Required'));
    }
  });
}

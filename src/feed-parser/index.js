import check from 'check-types';
import { parseString as parseXMLString } from 'xml2js';

export default function parseSyndicationFeed(feedString) {
  return new Promise((resolve, reject) => {
    if (!check.nonEmptyString(feedString)) {
      reject(new Error('Valid RSS/ATOM Required'));
    }

    parseXMLString(feedString, (error, result) => {
      if (error) {
        reject(new Error('Valid RSS/ATOM Required'));
      }
      resolve(result);
    });
  });
}

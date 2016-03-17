import check from 'check-types';
import { parseString as parseXMLString } from 'xml2js';
import parseRSSPosts from './parse-rss';
import parseATOMPosts from './parse-atom';

function isRSS(parsedXml) {
  return parsedXml.rss !== undefined;
}

function isATOM(parsedXml) {
  return parsedXml.feed !== undefined;
}

export default function parseSyndicationFeed(feedString) {
  return new Promise((resolve, reject) => {
    if (!check.nonEmptyString(feedString)) {
      reject(new Error('Valid RSS/ATOM Required'));
    }

    parseXMLString(feedString, (error, parsedXML) => {
      if (error) {
        reject(new Error('Valid RSS/ATOM Required'));
      }

      if (isRSS(parsedXML)) {
        const posts = parseRSSPosts(parsedXML);
        resolve(posts);
      } else if (isATOM(parsedXML)) {
        const posts = parseATOMPosts(parsedXML);
        resolve(posts);
      } else {
        reject(new Error('Valid RSS/ATOM Required'));
      }
    });
  });
}

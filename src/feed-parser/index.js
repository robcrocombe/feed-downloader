import check from 'check-types';
import { parseString as parseXMLString } from 'xml2js';

export default function parseSyndicationFeed(feedString) {
  return new Promise((resolve, reject) => {
    if (!check.nonEmptyString(feedString)) {
      reject(new Error('Valid RSS/ATOM Required'));
    }

    parseXMLString(feedString, (error, parsedXML) => {
      if (error) {
        reject(new Error('Valid RSS/ATOM Required'));
      }

      const posts = parsedXML.rss.channel[0].item.map(item => {
        const blogPost = {
          title: item.title[0],
          link: item.link[0]
        };

        if (item.description) { blogPost.description = formatDescription(item.description[0]); }
        return blogPost;
      });
      resolve(posts);
    });
  });
}

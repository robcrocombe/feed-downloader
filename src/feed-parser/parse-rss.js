import moment from 'moment';
import formatDescription from './format-description';
import { extractRSSPostImage } from './extract-post-image';

export default function parseRSSPosts(parsedXML) {
  return parsedXML.rss.channel[0].item.map(item => {
    const blogPost = {
      title: item.title[0],
      link: item.link[0]
    };

    if (item.description) { blogPost.description = formatDescription(item.description[0]); }
    if (item.pubDate) { blogPost.datePublished = moment(new Date(item.pubDate)); }

    const image = extractRSSPostImage(item);
    if (image) { blogPost.imageURI = image; }

    return blogPost;
  });
}

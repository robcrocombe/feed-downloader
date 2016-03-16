import moment from 'moment';
import formatDescription from './format-description';
import { extractATOMPostImage } from './extract-post-image';

function getBestLink(postLinks) {
  let preferredLink = '';
  if (postLinks.length === 1) {
    preferredLink = postLinks[0].href;
  } else {
    // Prefer alternative URIs to self URIs
    const alternateLinks = postLinks.filter(link => link.$.rel === 'alternate').map(link => link.$.href);
    const selfLinks = postLinks.filter(link => link.$.rel === 'self').map(link => link.$.href);

    preferredLink = alternateLinks.length > 0 ? alternateLinks[0] : selfLinks[0];
  }
  return preferredLink;
}

function getDescription(post) {
  if (post.content) {
    return post.content[0]._;
  } else if (post.summary) {
    return post.summary[0]._;
  }
}

export default function parseATOMPosts(parsedXML) {
  return parsedXML.feed.entry.map(entry => {
    const blogPost = {
      title: entry.title[0]._,
      link: getBestLink(entry.link),
      description: formatDescription(getDescription(entry))
    };

    const image = extractATOMPostImage(entry);
    if (image) { blogPost.imageURI = image; }

    if (entry.updated) { blogPost.dateUpdated = moment(new Date(entry.updated[0])); }
    if (entry.published) { blogPost.datePublished = moment(new Date(entry.published[0])); }

    return blogPost;
  });
}

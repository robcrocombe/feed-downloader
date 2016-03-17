import moment from 'moment';
import URI from 'urijs';
import formatDescription from './format-description';
import { extractATOMPostImage } from './extract-post-image';

function getBestLink(postLinks) {
  let preferredLink = '';
  if (postLinks.length === 1) {
    preferredLink = postLinks[0].$.href;
  } else {
    // Prefer alternative URIs to self URIs
    const alternateLinks = postLinks.filter(link => link.$.rel === 'alternate').map(link => link.$.href);
    const selfLinks = postLinks.filter(link => link.$.rel === 'self').map(link => link.$.href);

    preferredLink = alternateLinks.length > 0 ? alternateLinks[0] : selfLinks[0];
  }
  return preferredLink;
}

function getTitle(post) {
  let title = '';
  if (post.title[0]._) {
    // Some titles include format information, and so their info resides in _
    title = post.title[0]._;
  } else {
    // Some contain just plain text titles, return directly
    return post.title[0];
  }
  return title;
}

export function getDescription(post) {
  let description = '';
  if (post.content) {
    description = post.content[0]._;
  } else {
    description = post.summary[0]._;
  }
  return description;
}

export function fixRelativePath(resource, postLink) {
  let resourceURI = new URI(resource);
  if (resourceURI.is('relative')) {
    resourceURI = resourceURI.absoluteTo(postLink).toString();
  }

  return resourceURI.toString();
}

export default function parseATOMPosts(parsedXML) {
  return parsedXML.feed.entry.map(entry => {
    const blogPost = {
      title: getTitle(entry),
      link: getBestLink(entry.link),
      description: formatDescription(getDescription(entry))
    };

    const image = extractATOMPostImage(entry);
    if (image) { blogPost.imageURI = fixRelativePath(image, blogPost.link); }

    if (entry.updated) { blogPost.dateUpdated = moment(new Date(entry.updated[0])); }
    if (entry.published) { blogPost.datePublished = moment(new Date(entry.published[0])); }

    return blogPost;
  });
}

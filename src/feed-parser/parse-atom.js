import formatDescription from './format-description';

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

export default function parseATOMPosts(parsedXML) {
  return parsedXML.feed.entry.map(entry => {
    const blogPost = {
      title: entry.title[0]._,
      link: getBestLink(entry.link),
      description: formatDescription(entry.content[0]._)
    };
    return blogPost;
  });
}

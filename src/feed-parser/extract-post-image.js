import url from 'url';

function removeImageSizeGetParamsFromURI(imageURL) {
  // Wordpress tends to add image resizing get parameters. Remove them for full size image
  return `${imageURL.protocol}${imageURL.slashes ? '//' : ''}${imageURL.host}${imageURL.pathname}`;
}

function isGravatar(imageURL) {
  return (imageURL.hostname.includes('gravatar.com'));
}

export default function extractPostImage(post) {
  if (post['media:content']) {
    // Wordpress uses media:content for images. 0th index is first or feature image,
    const imageURL = url.parse(post['media:content'][0].$.url);

    // except when it's a gravatar
    if (!isGravatar(imageURL)) {
      return removeImageSizeGetParamsFromURI(imageURL);
    }
  }
}

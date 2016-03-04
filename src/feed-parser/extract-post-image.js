import url from 'url';

function removeImageSizeGetParamsFromURI(imageUriString) {
  // Wordpress tends to add image resizing get parameters. Remove them for full size image
  const imageUrl = url.parse(imageUriString);
  return `${imageUrl.protocol}${imageUrl.slashes ? '//' : ''}${imageUrl.host}${imageUrl.pathname}`;
}

export default function extractPostImage(post) {
  if (post['media:content']) {
    // Wordpress uses media:content for images. 0th index is first or feature image
    const imageURI = post['media:content'][0].$.url;
    return removeImageSizeGetParamsFromURI(imageURI);
  }
}

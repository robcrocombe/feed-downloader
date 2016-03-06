import url from 'url';
import cheerio from 'cheerio';

function removeImageSizeGetParamsFromURL(imageURL) {
  // Wordpress tends to add image resizing get parameters. Remove them for full size image
  return `${imageURL.protocol}${imageURL.slashes ? '//' : ''}${imageURL.host}${imageURL.pathname}`;
}

function isGravatar(imageURL) {
  return (imageURL.hostname.includes('gravatar.com'));
}

function extractImageFromDescriptionHTML(description) {
  const $ = cheerio.load(description);
  const firstImage = $('img').first().attr('src');

  if (firstImage) {
    return firstImage;
  }
}

export function extractRSSPostImage(post) {
  if (post['media:content']) {
    // Wordpress uses media:content for images. 0th index is first or feature image,
    const imageURL = url.parse(post['media:content'][0].$.url);

    // except when it's a gravatar
    if (!isGravatar(imageURL)) {
      return removeImageSizeGetParamsFromURL(imageURL);
    }
  }
}

export function extractATOMPostImage(post) {
  const imageFromDescription = extractImageFromDescriptionHTML(post.content[0]._);
  if (imageFromDescription) {
    return imageFromDescription;
  }
}

import URI from 'urijs';
import cheerio from 'cheerio';
import { getDescription } from './parse-atom';

function imageURIAbsoluteToBlog(imageURI) {
  return imageURI.absoluteTo('http://www.alexpringle.co.uk');
}

function removeImageSizeGetParamsFromURL(imageURI) {
  // Wordpress tends to add image resizing get parameters. Remove them for full size image
  return imageURI.removeSearch(['w', 'h']);
}

function isGravatar(imageURI) {
  return (imageURI.hostname().includes('gravatar.com'));
}

function extractImageFromDescriptionHTML(description) {
  const $ = cheerio.load(description);
  const firstImage = $('img').first().attr('src');

  if (firstImage) {
    return new URI(firstImage);
  }
}

export function extractRSSPostImage(post) {
  if (post['media:content']) {
    // Wordpress uses media:content for images. 0th index is first or feature image,
    const imageURI = new URI(post['media:content'][0].$.url);

    // except when it's a gravatar
    if (!isGravatar(imageURI)) {
      return removeImageSizeGetParamsFromURL(imageURI).toString();
    }
  }
}

export function extractATOMPostImage(post) {
  const imageFromDescription = extractImageFromDescriptionHTML(getDescription(post));
  if (imageFromDescription) {
    return imageURIAbsoluteToBlog(imageFromDescription).toString();
  }
}

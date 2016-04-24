import URI from 'urijs';
import cheerio from 'cheerio';
import { getDescription as getAtomDescription } from './parse-atom';

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
  let imageURI = null;
  if (post['media:content']) {
    // Wordpress uses media:content for images. 0th index is first or feature image,
    imageURI = new URI(post['media:content'][0].$.url);
  }

  if (!imageURI && post['content:encoded']) {
    imageURI = extractImageFromDescriptionHTML(post['content:encoded'][0]);
  }

  if (!imageURI && post.description) {
    imageURI = extractImageFromDescriptionHTML(post.description[0]);
  }

  // Gravatar images aren't what we're after
  if (imageURI && !isGravatar(imageURI)) {
    return removeImageSizeGetParamsFromURL(imageURI).toString();
  }
}

export function extractATOMPostImage(post) {
  const imageFromDescription = extractImageFromDescriptionHTML(getAtomDescription(post));
  if (imageFromDescription) {
    return imageFromDescription.toString();
  }
}

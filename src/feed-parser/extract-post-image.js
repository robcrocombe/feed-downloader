import URI from 'urijs';
import cheerio from 'cheerio';
import { getDescription as getAtomDescription } from './parse-atom';

function removeImageSizeGetParamsFromURL(imageURI) {
  // Wordpress tends to add image resizing get parameters. Remove them for full size image
  return imageURI.removeSearch(['w', 'h', 'resize']);
}

function isGravatar(imageURI) {
  return (imageURI.hostname().includes('gravatar.com'));
}

function isWordPressAddCommentImage(imageURI) {
  return (imageURI.toString().includes('http://feeds.wordpress.com/1.0/comments'));
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

  // Reject gravatar images and click to comment images
  if (imageURI && !isGravatar(imageURI) && !isWordPressAddCommentImage(imageURI)) {
    return removeImageSizeGetParamsFromURL(imageURI).toString();
  }
}

export function extractATOMPostImage(post) {
  const imageFromDescription = extractImageFromDescriptionHTML(getAtomDescription(post));
  if (imageFromDescription) {
    return imageFromDescription.toString();
  }
}

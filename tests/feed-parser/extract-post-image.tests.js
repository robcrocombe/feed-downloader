import { extractRSSPostImage } from '../../src/feed-parser/extract-post-image';
import dcsMediaContent from './post-objects/dcs-media-content';
import dcsMediaContentGravatarOnly from './post-objects/dcs-media-content-gravatar-only';
import dcsNoImage from './post-objects/dcs-no-image';

const expect = global.expect;
describe('extract-post-image', () => {
  describe('extractPostImage(post)', () => {
    it('should extract first image from a post with media:content elements and remove size parameters', () => {
      expect(extractRSSPostImage(dcsMediaContent)).to.equal('https://dannycomputerscientist.files.wordpress.com/2015/08/screen-shot-2015-08-02-at-21-16-29.png');
    });

    it('should ignore gravatar images if they are the only image in the post', () => {
      expect(extractRSSPostImage(dcsMediaContentGravatarOnly)).to.equal(undefined);
    });

    it('should return undefined if there is no image in post', () => {
      expect(extractRSSPostImage(dcsNoImage)).to.equal(undefined);
    });
  });
});

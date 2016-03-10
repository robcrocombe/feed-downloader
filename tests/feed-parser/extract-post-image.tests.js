import { extractRSSPostImage, extractATOMPostImage } from '../../src/feed-parser/extract-post-image';
import dcsMediaContent from './post-objects/dcs-media-content';
import dcsMediaContentGravatarOnly from './post-objects/dcs-media-content-gravatar-only';
import dcsNoImage from './post-objects/dcs-no-image';

import bloggerImageInDescription from './post-objects/blogger-image-in-description';
import bloggerNoImage from './post-objects/blogger-no-image';

const expect = global.expect;
describe('extract-post-image', () => {
  describe('extractRSSPostImage(post)', () => {
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

  // describe('extractATOMPostImage', () => {
  //   it('should extract first image in description HTML', () => {
  //     expect(extractATOMPostImage(bloggerImageInDescription)).to.equal('https://1.bp.blogspot.com/-74kEkoti2zU/Vs84kp7mLdI/AAAAAAAAEM0/MFcbjuNxPM8/s640/2016-02-25_17-18-06.png');
  //   });

  //   it('should return undefined if there is no image in post', () => {
  //     expect(extractATOMPostImage(bloggerNoImage)).to.equal(undefined);
  //   });
  // });
});

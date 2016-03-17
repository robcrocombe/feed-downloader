import formatDescription from '../../src/feed-parser/format-description';

const expect = global.expect;

describe('format-description', () => {
  describe('formatDescription(description)', () => {
    it('should trim descriptions so there is no white space at the beginning or end', () => {
      const untrimmedString = '  this string has unnecessary white space ';
      expect(formatDescription(untrimmedString)).to.equal('this string has unnecessary white space');
    });

    it('should remove any HTML tags but retain text content', () => {
      const htmlString = '<b>Danny</b> is a <i>cool guy</i>, but does he really need to <u>underline</u> everything?';
      expect(formatDescription(htmlString)).to.equal('Danny is a cool guy, but does he really need to underline everything?');
    });

    it('should decode HTML Entities (names and numbers)', () => {
      const entites = '&#33;&quot;&#60;&gt;&#64;&#8212;';
      expect(formatDescription(entites)).to.equal('!"<>@—');
    });

    it('should remove ellipses added by wordpress to end of descriptions', () => {
      const descriptionEndingInEllipses = 'Interesting things await [&#8230;]';
      expect(formatDescription(descriptionEndingInEllipses)).to.equal('Interesting things await');
    });

    it('should parse a wordpress.com description correctly', () => {
      const wordpressComDescription = 'On January 23rd I graduated with an MSc in Advanced Computer Science from The University of York. It was a nice occasion to get together and be merry with the family, and of course for some photos in my cap and gown &#8212; this time they were grey and blue. My parents took my degree [&#8230;]<img alt="" border="0" src="https://pixel.wp.com/b.gif?host=dannycomputerscientist.wordpress.com&#038;blog=27683847&#038;post=3840&#038;subd=dannycomputerscientist&#038;ref=&#038;feed=1" width="1" height="1" />';

      expect(formatDescription(wordpressComDescription)).to.equal('On January 23rd I graduated with an MSc in Advanced Computer Science from The University of York. It was a nice occasion to get together and be merry with the family, and of course for some photos in my cap and gown — this time they were grey and blue. My parents took my degree');
    });

    it('should parse a blogger description (<content>/<summary>) correctly', () => {
      const bloggerContent = 'A quick update on what I\'ve been working on recently.<br /><br />For one of my modules Simulations and 3D Graphics, we were set a task to learn lighting and materials. So far I have implemented a single light, using ADS and blinn-phong (again).<br /><br /><div class="separator" style="clear: both; text-align: center;"><a href="https://1.bp.blogspot.com/-74kEkoti2zU/Vs84kp7mLdI/AAAAAAAAEM0/MFcbjuNxPM8/s1600/2016-02-25_17-18-06.png" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="504" src="https://1.bp.blogspot.com/-74kEkoti2zU/Vs84kp7mLdI/AAAAAAAAEM0/MFcbjuNxPM8/s640/2016-02-25_17-18-06.png" width="640" /></a></div><br />The camera can rotate, move forward/backward. The armadillo can be rotated on it\'s <span data-dobid="hdw">pedestal and the whole scene can be rotated.</span>';

      expect(formatDescription(bloggerContent)).to.equal('A quick update on what I\'ve been working on recently.For one of my modules Simulations and 3D Graphics, we were set a task to learn lighting and materials. So far I have implemented a single light, using ADS and blinn-phong (again).The camera can rotate, move forward/backward. The armadillo can be rotated on it\'s pedestal and the whole scene can be rotated.');
    });
  });
});

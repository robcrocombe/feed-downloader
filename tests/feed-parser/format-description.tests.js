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
  });
});

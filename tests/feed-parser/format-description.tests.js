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
  });
});

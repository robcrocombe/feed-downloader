import formatDescription from '../../src/feed-parser/format-description';

const expect = global.expect;

describe('format-description', () => {
  describe('formatDescription(description)', () => {
    it('should trim descriptions so there is no white space at the beginning or end', () => {
      const untrimmedString = '  this string has unnecessary white space ';
      expect(formatDescription(untrimmedString)).to.equal('this string has unnecessary white space');
    });
  });
});

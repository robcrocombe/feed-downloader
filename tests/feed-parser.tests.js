import parseSyndicationFeed from '../src/feed-parser';

const expect = global.expect;

describe('feed-parser', () => {
  describe('parseSyndicationFeed(feedString)', () => {
    it('should throw if feedString is null, empty or not a string', () =>
      Promise.all([
        expect(parseSyndicationFeed(null)).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed('')).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed(1)).to.be.rejectedWith('Valid RSS/ATOM Required')
      ])
    );
  });
});

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

    it('should throw if feedString is not a valid XML document', () =>
      Promise.all([
        expect(parseSyndicationFeed('{data: \'This is JSON not XML\'}')).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed('<?xml version = "1.0"?><data><<</data>')).to.be.rejectedWith('Valid RSS/ATOM Required')
      ])
    );
  });
});

import fs from 'fs';
import parseSyndicationFeed from '../src/feed-parser';

const expect = global.expect;
const TEST_FEEDS_DIRECTORY = './tests/syndication-feeds/';

function loadTestSyndicationFeed(type, name) {
  return fs.readFileSync(`${TEST_FEEDS_DIRECTORY}${type}/${name}.${type}`, { encoding: 'utf8' });
}

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

    it('should correctly parse minimum.rss', () => {
      loadTestSyndicationFeed('rss', 'minimum');
    });
  });
});

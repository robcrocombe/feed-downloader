import requestIfModifiedSince from '../../src/http/if-modified-since-request';
import * as httpMocks from '../mocks/http-mocks';

const expect = global.expect;

describe('if-modified-since-request', () => {
  describe('requestIfModifiedSince(url, dateTime)', () => {
    it('should return modified:false if status code 304', done => {
      httpMocks.mockUnmodifiedResponse();
      requestIfModifiedSince('https://httpmock-feeds.com/not-modified', new Date()).then(result => {
        expect(result.modified).to.equal(false);
        done();
      }).catch(done);
    });

    it(`should return data and new lastModifiedDate if status code 200`, done => {
      const expectedModifiedDate = httpMocks.mockModifiedResponse();
      requestIfModifiedSince('https://httpmock-feeds.com/modified', new Date()).then(result => {
        expect(result.data).to.equal(httpMocks.expectedFeedData);
        expect(result.lastModified.toUTCString()).to.equal(expectedModifiedDate.toUTCString());
        done();
      }).catch(done);
    });

    it('should throw error if connection times out / DNS lookup fails etc', () =>
      expect(requestIfModifiedSince('https://madeupurl983989238893283928392389283892382.com', new Date())).to.be.rejectedWith('HTTP request unsuccessful')
    );

    it('should throw error if non-success status code recieved', () => {
      httpMocks.mock404Response();
      return expect(requestIfModifiedSince('https://httpmock-feeds.com/404', new Date())).to.be.rejectedWith('Non-success status code');
    });

    it('should throw error if DateTime not provided', () =>
      expect(requestIfModifiedSince('https://httpmock-feeds.com/modified')).to.be.rejectedWith('Valid DateTime required')
    );

    it('should throw error if DateTime is not a valid Date', () =>
      expect(requestIfModifiedSince('https://httpmock-feeds.com/modified'), '').to.be.rejectedWith('Valid DateTime required')
    );

    it('should throw error if non-string URI is provided', () =>
      expect(requestIfModifiedSince(null, new Date())).to.be.rejectedWith('Valid URI required')
    );
  });
});

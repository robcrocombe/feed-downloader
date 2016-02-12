import requestIfModifiedSince from '../src/http/if-modified-since-request';
import * as httpMocks from './mocks/http-mocks';

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

    it(`should return modified:true, data and new lastModifiedDate if status code 200`, done => {
      httpMocks.mockModifiedResponse();
      requestIfModifiedSince('https://httpmock-feeds.com/modified', new Date()).then(result => {
        expect(result.modified).to.equal(true);
        expect(result.data).to.equal(httpMocks.expectedFeedData);
        expect(result.lastModified).to.equal(httpMocks.expectedModifiedDate);
        done();
      }).catch(done);
    });

    it('should throw error if DateTime not provided', () =>
      expect(requestIfModifiedSince('https://httpmock-feeds.com/modified')).to.be.rejectedWith('Valid DateTime required')
    );

    it('should throw error if DateTime is not a valid Date', () =>
      expect(requestIfModifiedSince('https://httpmock-feeds.com/modified'), '').to.be.rejectedWith('Valid DateTime required')
    );

    it('should throw error if non-string URI is provided', () =>
      expect(requestIfModifiedSince(null, new Date())).to.be.rejectedWith('URI required')
    );
  });
});

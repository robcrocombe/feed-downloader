import * as httpMocks from '../mocks/http-mocks';
import request from '../../src/http/request';

const expect = global.expect;

describe('request', () => {
  describe('httpRequest(uri)', () => {
    it('should return lastModified date and data if status code 200', done => {
      const expectedModifiedDate = httpMocks.mockModifiedResponse();
      request('https://httpmock-feeds.com/modified').then(result => {
        expect(result.lastModified.toUTCString()).to.equal(expectedModifiedDate.toUTCString());
        expect(result.data).to.equal(httpMocks.expectedFeedData);
        done();
      }).catch(done);
    });

    it('should throw error if non-success status code recieved', () => {
      httpMocks.mock404Response();
      return expect(request('https://httpmock-feeds.com/404')).to.be.rejectedWith('Non-success status code');
    });

    it('should throw error if connection times out / DNS lookup fails etc', () =>
      expect(request('https://madeupurl983989238893283928392389283892382.com')).to.be.rejectedWith('HTTP request unsuccessful')
    );

    it('should throw error if non-string URI provided', () =>
      expect(request(null)).to.be.rejectedWith('Valid URI required')
    );
  });
});

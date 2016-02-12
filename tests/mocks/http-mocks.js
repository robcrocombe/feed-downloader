import nock from 'nock';

export function mockUnmodifiedResponse() {
  let modifiedSince = null;
  nock('https://httpmock-feeds.com', {
    reqHeaders: {
      'If-Modified-Since': value => {
        if (value) {
          modifiedSince = value;
        } else {
          return false;
        }
      }
    }
  }).get('/not-modified')
    .reply(304, '', {
      'Last-Modified': modifiedSince
    });
}

export const expectedFeedData = `<?xml version="1.0"?>
                                 <rss version="2.0">
                                   <channel>
                                     <title>Example Channel</title>
                                     <link>http://example.com/</link>
                                     <description>My example channel</description>
                                     <item>
                                       <title>News for September the Second</title>
                                       <link>http://example.com/2002/09/01</link>
                                       <description>other things happened today</description>
                                     </item>
                                     <item>
                                       <title>News for September the First</title>
                                       <link>http://example.com/2002/09/02</link>
                                     </item>
                                   </channel>
                                 </rss>`;

export function mockModifiedResponse() {
  const mockModifiedDate = new Date();
  nock('https://httpmock-feeds.com')
    .get('/modified')
    .reply(200, expectedFeedData, { 'Last-Modified': mockModifiedDate.toUTCString() });
  return mockModifiedDate;
}

export function mock404Response() {
  nock('https://httpmock-feeds.com')
    .get('/404')
    .reply(404, 'Not Found');
}

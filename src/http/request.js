import request from 'request';
import log from '../log';

export default function httpRequest(uri) {
  return new Promise((resolve, reject) => {
    request(uri, (error, response, data) => {
      if (error) {
        log.error({ uri, error },
                  'HTTP Request for resource resulted in error');
        reject(new Error('HTTP request unsuccessful'));
      }

      if ((response.statusCode !== 200)) {
        log.info({ uri, response }, 'HTTP Request returned non-success status code');
        reject(new Error('Non-success status code'));
      } else {
        const lastModifiedDateTime = new Date(response.headers['last-modified']);
        resolve({ lastModified: lastModifiedDateTime, data });
      }
    });
  });
}

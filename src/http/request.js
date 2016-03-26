import request from 'request';
import log from '../log';
import check from 'check-types';

export default function httpRequest(uri) {
  return new Promise((resolve, reject) => {
    request({ uri, timeout: process.env.CSBLOGS_HTTP_TIMEOUT_IN_MILLISECONDS }, (error, response, data) => {
      if (!check.nonEmptyString(uri)) {
        reject(new Error('Valid URI required'));
      }

      if (error) {
        log.error({ uri, error },
                  'HTTP Request for resource resulted in error');
        reject(new Error('HTTP request unsuccessful'));
      } else {
        if ((response.statusCode !== 200)) {
          log.info({ uri, response }, 'HTTP Request returned non-success status code');
          reject(new Error('Non-success status code'));
        } else {
          const lastModifiedDateTime = new Date(response.headers['last-modified']);
          resolve({ lastModified: lastModifiedDateTime, data });
        }
      }
    });
  });
}

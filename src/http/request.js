import request from 'request';
import log from '../log';
import config from '../../config/config.json';
import check from 'check-types';
import getLastModifiedDate from './get-last-modified-date';

export default function httpRequest(uri) {
  return new Promise((resolve, reject) => {
    request({
      uri,
      timeout: config.http.timeoutInMilliseconds,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    }, (error, response, data) => {
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
          const lastModifiedDateTime = getLastModifiedDate(response.headers);
          resolve({ lastModified: lastModifiedDateTime, data });
        }
      }
    });
  });
}

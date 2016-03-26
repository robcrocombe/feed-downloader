import request from 'request';
import log from '../log';
import check from 'check-types';

export default function httpRequestIfModifiedSince(uri, dateTime) {
  return new Promise((resolve, reject) => {
    if (!dateTime || check.instance(dateTime, Date.prototype)) {
      reject(new Error('Valid DateTime required'));
    }

    if (!check.nonEmptyString(uri)) {
      reject(new Error('Valid URI required'));
    }

    const requestOptions = {
      uri,
      headers: { 'If-Modified-Since': dateTime.toUTCString() },
      timeout: process.env.CSBLOGS_HTTP_TIMEOUT_IN_MILLISECONDS
    };

    request(requestOptions, (error, response, data) => {
      if (error) {
        log.error({ uri, error },
                  'HTTP Request for resource resulted in error');
        reject(new Error('HTTP request unsuccessful'));
      } else {
        if ((response.statusCode !== 200 && response.statusCode !== 304)) {
          log.info({ uri, response }, 'HTTP Request returned non-success status code');
          reject(new Error('Non-success status code'));
        } else {
          if (response.statusCode === 304) {
            log.info({ uri, lastModified: dateTime.toUTCString() },
                    'Requested resource has not been modified since lastModified date');
            resolve({ modified: false });
          } else {
            const newLastModifiedDateTime = new Date(response.headers['last-modified']);

            log.info({ uri,
                       oldLastModified: dateTime.toUTCString(),
                       newLastModified: newLastModifiedDateTime.toUTCString()
                     }, 'Requested resource has been modified since oldLastModified date');

            resolve({ lastModified: newLastModifiedDateTime, data });
          }
        }
      }
    });
  });
}

import request from 'request';
import log from '../log';

export default function requestIfModifiedSince(uri, dateTime = null) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      uri,
      headers: { 'If-Modified-Since': dateTime.toUTCString() }
    };

    request(requestOptions, (error, response, body) => {
      if (error) {
        log.error({ uri, error },
                  'HTTP Request for resource resulted in error');
        reject(new Error('HTTP request unsuccessful'));
      }

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

          resolve({ modified: true, newLastModifiedDateTime, body });
        }
      }
    });
  });
}

import request from 'request';
import moment from 'moment';

function dateTimeToRFC822Format(dateTime) {
  return moment(dateTime).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
}

export default function requestIfModifiedSince(uri, dateTime = null) {
  return new Promise((resolve, reject) => {
    const headerDate = dateTimeToRFC822Format(dateTime);
    const requestOptions = {
      uri,
      headers: { 'If-Modified-Since': headerDate }
    };
    request(requestOptions, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

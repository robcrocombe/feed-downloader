// This function invokes the AWS Lambda Handle as AWS would
// but allows you to do it from your local machine for development
// or from a non-AWS server

import handle from './lambda-handle';
import log from './log';

handle({}, {
  succeed: (result) => {
    log.info({ result: result || 'No result returned' }, 'Process succeeded');
  },
  fail: (error) => {
    log.error({ error: error || 'No error returned' }, 'Process failed');
  }
});

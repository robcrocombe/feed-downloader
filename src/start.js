// This function invokes the AWS Lambda Handle as AWS would
// but allows you to do it from your local machine for development
// or from a non-AWS server

import { handle } from './lambda-handle';
import log from './log';

handle({}, {
  done: (error, info) => {
    if (info) {
      log.info(info, 'Feed downloading process completed with information');
    } else {
      log.info('Feed downloading process completed');
    }
  }
});

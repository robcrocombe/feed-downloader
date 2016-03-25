// This function invokes the AWS Lambda Handle as AWS would
// but allows you to do it from your local machine for development
// or from a non-AWS server

// Loads environmental variables using dotenv file, which would be handled by AWS otherwise

import { handle } from './lambda-handle';
import log from './log';
import dotenv from 'dotenv';

dotenv.config();

handle({}, {
  succeed: result => {
    log.info({ result: result || 'No result returned' }, 'Process succeeded');
  },
  fail: error => {
    log.error({ error: error || 'No error returned' }, 'Process failed');
  }
});

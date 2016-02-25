import log from './log';
import aggregate from './aggregate.js';

export function handle(event, context) {
  log.info('CS Blogs Feed Aggregator Started');
  aggregate()
    .then(() => {
      // context.succeed() called so AWS knows function completed successfully
      context.succeed();
    })
    .catch(error => {
      // context.fail() to report error to AWS Lambda
      context.fail(error);
    });
}

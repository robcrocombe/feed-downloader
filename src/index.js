import log from './log';
import aggregate from './aggregator';

export default function handle(context) {
  log.info('CS Blogs Feed Aggregator started');
  aggregate()
    .then(() => {
      // context.done() called so Azure knows function completed successfully
      context.done();
    })
    .catch((error) => {
      // context.done(error) to report error to Azure Function
      context.done(error);
    });
}

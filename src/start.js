import aggregate from './aggregator';
import log from './log';

log.info('CS Blogs Feed Aggregator started');
aggregate()
  .then(() => {
    log.info('Completed successfully');
  })
  .catch((error) => {
    log.error(error);
  });

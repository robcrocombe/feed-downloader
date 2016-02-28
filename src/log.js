import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'csblogs-feed-downloader'
});

if ((process.env.npm_lifecycle_script === 'babel-node ./node_modules/istanbul/lib/cli cover node_modules/mocha/bin/_mocha -- --require tests/chai-config.js --recursive ./tests/**/*.tests.js')) {
  // Running in test mode. Prevent logging to stdout (makes mocha output easier to read).
  log.streams = [];
}

export default log;

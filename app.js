'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handle;

var _aggregator = require('./aggregator');

var _aggregator2 = _interopRequireDefault(_aggregator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handle(context) {
  context.log('CS Blogs Feed Aggregator started');
  (0, _aggregator2.default)().then(function () {
    // context.done() called so Azure knows function completed successfully
    context.done();
  }).catch(function (error) {
    // context.done(error) to report error to Azure Function
    context.done(error);
  });
}

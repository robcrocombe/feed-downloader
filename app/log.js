"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require("bunyan");

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _bunyan2.default.createLogger({ name: "csblogs-feed-downloader" });
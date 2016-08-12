# CS Blogs Feed Downloader
[![Build Status](https://travis-ci.org/csblogs/feed-downloader.svg?branch=master)](https://travis-ci.org/csblogs/feed-downloader)
[![Coverage Status](https://coveralls.io/repos/github/csblogs/feed-downloader/badge.svg?branch=master)](https://coveralls.io/github/csblogs/feed-downloader?branch=master)
[![Code Climate](https://codeclimate.com/github/csblogs/feed-downloader/badges/gpa.svg)](https://codeclimate.com/github/csblogs/feed-downloader)
[![Dependency Status](https://david-dm.org/csblogs/feed-downloader.svg)](https://david-dm.org/csblogs/feed-downloader)
[![Slack Status](http://csblogs-slack-signup.azurewebsites.net/badge.svg)](http://csblogs-slack-signup.azurewebsites.net)

The service which aggregates the new blog posts of [Computer Science Blogs](http://csblogs.com) users. 

It replaces the [csblogs-feed-aggregator](https://github.com/csblogs/csblogs-feed-aggregator) and improves upon it in the following ways:
* Can correctly parse a larger range of syndication feeds. ATOM feed parsing is significantly improved.
* Is much easier to modify and extend thanks to the use of a full behavioural test suite and code linting
* Discovery of new blog posts kicks off the Amazon Simple Notification Service to inform future iOS/Android CS Blogs apps and the CS Blogs Slack group
* Move to PostgreSQL from MongoDB
* Performance is improved by
  * Using an [If-Modified-Since](http://www.freesoft.org/CIE/RFC/1945/58.htm) HTTP request to only download and parse feeds that purports to have changed
  * Increased use of concurrency using [ES2015 Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)

The application uses some AWS (Amazon Web Services) specific features, however it is platform agnostic and can be ran from any system which supports Node.js. The transpiled output of the source code has been verified as working on node v0.10.36 and above.

## Contributing
If you'd like to contribute to this project then checkout the [contributing guide](https://github.com/csblogs/feed-downloader/blob/master/CONTRIBUTING.md).

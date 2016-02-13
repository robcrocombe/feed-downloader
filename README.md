# CS Blogs Feed Downloader
[![Build Status](https://travis-ci.org/csblogs/feed-downloader.svg?branch=master)](https://travis-ci.org/csblogs/feed-downloader)

The service which aggregates the new blog posts of [Computer Science Blogs](http://csblogs.com) users. 

feed-downloader replaces the csblogs-feed-aggregator service which wasn't well tested and mainly consisted of spaghetti code. This service intends to avoid a repeat of that by using ES2015 (via Babel transpilation), ESLint code linting and Chai/Mocha behaviour and unit tests with high code coverage.

As a standard node.js application it can be ran from any device with a node runtime, however it is expected that in production the feed-downloader will be ran as an AWS Lambda application.

**Roadmap:**
* Develop parser for RSS and ATOM feeds
* Develop blog post persistence to postgres DB
* Add new blog notification support (through Amazon SNS)
* Replace cs-blogs-feed-aggregator in production

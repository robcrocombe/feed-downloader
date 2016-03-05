import fs from 'fs';
import moment from 'moment';
import parseSyndicationFeed from '../../src/feed-parser';

const expect = global.expect;
const TEST_FEEDS_DIRECTORY = './tests/syndication-feeds/';

function loadTestSyndicationFeed(type, name) {
  return fs.readFileSync(`${TEST_FEEDS_DIRECTORY}${type}/${name}.${type}`, { encoding: 'utf8' });
}

describe('feed-parser', () => {
  describe('parseSyndicationFeed(feedString)', () => {
    it('should throw if feedString is null, empty or not a string', () =>
      Promise.all([
        expect(parseSyndicationFeed(null)).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed('')).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed(1)).to.be.rejectedWith('Valid RSS/ATOM Required')
      ])
    );

    it('should throw if feedString is not a valid XML document', () =>
      Promise.all([
        expect(parseSyndicationFeed('{data: \'This is JSON not XML\'}')).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed('<?xml version = "1.0"?><data><<</data>')).to.be.rejectedWith('Valid RSS/ATOM Required')
      ])
    );

    it('should correctly parse minimum.rss', () => {
      const minimumRSS = loadTestSyndicationFeed('rss', 'minimum');
      const expectedItems = [
        {
          title: 'You won\'t believe what happened next!',
          link: 'http://example.com/what-happened-next',
          description: 'Something uninteresting, you got click baited!'
        },
        {
          title: 'Blog Authors hate him!',
          link: 'http://example.com/blog-authors-hate-him'
        }
      ];
      return expect(parseSyndicationFeed(minimumRSS)).to.eventually.deep.equal(expectedItems);
    });

    it('should correctly parse blogger.atom', () => {
      const bloggerATOM = loadTestSyndicationFeed('atom', 'blogger');
      const expectedItems = [];
      return expect(parseSyndicationFeed(bloggerATOM)).to.eventually.deep.equal(expectedItems);
    });

    it('should correctly parse wordpress.com.rss', () => {
      const wordpressComRSS = loadTestSyndicationFeed('rss', 'wordpress.com');
      const expectedItems = [
        {
          title: 'Graduating from York',
          link: 'https://dannycomputerscientist.wordpress.com/2016/02/05/graduating-from-york/',
          description: 'On January 23rd I graduated with an MSc in Advanced Computer Science from The University of York. It was a nice occasion to get together and be merry with the family, and of course for some photos in my cap and gown — this time they were grey and blue. My parents took my degree',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2016/02/img_0091.jpg',
          datePublished: moment(new Date('Fri, 05 Feb 2016 18:05:12 +0000'))
        },
        {
          title: 'HackTrain 2.0',
          link: 'https://dannycomputerscientist.wordpress.com/2016/01/10/hacktrain-2-0/',
          description: 'It seems like a lifetime ago, but the first HackTrain event was actually only 9 months ago — It probably feels so long ago to me as so much has change in the interim, including me getting a job as a result of the first event. When an opportunity came up to represent Trainline at',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/12304083_786742814805282_703787864428458423_o.jpg',
          datePublished: moment(new Date('Sun, 10 Jan 2016 22:01:22 +0000'))
        },
        {
          title: 'Centre for Computing History',
          link: 'https://dannycomputerscientist.wordpress.com/2016/01/10/centre-for-computing-history/',
          description: 'Since September, Charlotte and I have lived about a minutes walk from the UK Computer Museum (which also seems to go by the name Centre for Computing History), but we’d never actually gone inside. Today after my flying lesson we went to have a quick look. Whilst it made me feel old to see things I',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2016/01/bbc-micro.jpg',
          datePublished: moment(new Date('Sun, 10 Jan 2016 17:39:38 +0000'))
        },
        {
          title: 'Tracking Moving Trains (with the minimum possible effort)',
          link: 'https://dannycomputerscientist.wordpress.com/2015/12/22/tracking-moving-trains-with-minimum-possible-effort/',
          description: 'Trains are, in many respects, wonderful machines. They’re simultaneously both the most romantic form of travel and the most grueling way to get to work every morning. One thing trains are not however, is up-to-date with modern technology. Whilst you can follow the course, in real time, of a plane soaring at 36,000 feet above',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/12106848_1494412047526257_4658382875925199724_n.jpg',
          datePublished: moment(new Date('Tue, 22 Dec 2015 01:52:55 +0000'))
        },
        {
          title: 'Captain Danny',
          link: 'https://dannycomputerscientist.wordpress.com/2015/12/09/captain-danny/',
          description: 'One of the nice things about working, opposed to studying, is that I now don’t feel guilty about not spending all my time working on coursework. Time for a hobby! Living 15 minutes walk from Cambridge Airport I quite often see people learning to fly, and thought it looked like fun — so decided to start',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/img_05611.jpg',
          datePublished: moment(new Date('Wed, 09 Dec 2015 21:12:16 +0000'))
        },
        {
          title: 'Trainline at Silicon Milkroundabout',
          link: 'https://dannycomputerscientist.wordpress.com/2015/12/04/trainline-at-silicon-milkroundabout/',
          description: 'A few weeks ago I was lucky enought to be part of the team that tried, and hopefully succeeded, to entice more developers to come and work with us at Trainline at the Silicon Milkroundabout tech recruitment event. I really enjoy talking to people about technology and it was especially nice to talk to people who',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/img_0521.jpg',
          datePublished: moment(new Date('Fri, 04 Dec 2015 23:12:03 +0000'))
        },
        {
          title: 'On-boarding at Trainline',
          link: 'https://dannycomputerscientist.wordpress.com/2015/10/29/on-boarding-at-trainline/',
          description: 'I’m now entering the sixth week of my time at Trainline. It’s been quite the experience, due to it being my first full-time job and it being a time of significant changes at Trainline in terms of technology, branding and even an expansion into the European rail market. It’s been great to be in a',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/10/trainline-homepage.png',
          datePublished: moment(new Date('Thu, 29 Oct 2015 17:57:27 +0000'))
        },
        {
          title: 'MSc Finished',
          link: 'https://dannycomputerscientist.wordpress.com/2015/09/13/msc-finished/',
          description: 'Last week I submitted my thesis, workshop report and conference presentation for my MSc in Advanced Computer Science. Two days after my submission I was also required to present my research and answer a few questions fielded from a lecturer in Yorks Department of Computer Science who had not previously seen my work. The',
          datePublished: moment(new Date('Sun, 13 Sep 2015 01:13:58 +0000'))
        },
        {
          title: 'Expect the unexpected',
          link: 'https://dannycomputerscientist.wordpress.com/2015/08/02/expect-the-unexpected/',
          description: 'When you design software you usually have a few use cases in mind, in the case of EpsilonGit the use case I keep coming back to is a project lead who wants an overview of how his team is working and how they are using their version control software. Back in second year when I',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/08/screen-shot-2015-08-02-at-21-16-29.png',
          datePublished: moment(new Date('Sun, 02 Aug 2015 20:19:55 +0000'))
        },
        {
          title: 'Thesis writing begins',
          link: 'https://dannycomputerscientist.wordpress.com/2015/07/27/thesis-writing-begins/',
          description: 'Today I started work on my masters thesis covering my research for and development of EpsilonGit. There’s no template provided for the layout of such reports, so today I’ve been sketching out a rough outline of what I hope to include in the report. e.g. Chapter names, section headings and comments for things to talk',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/07/screen-shot-2015-07-27-at-22-02-20.png',
          datePublished: moment(new Date('Mon, 27 Jul 2015 21:13:14 +0000'))
        }
      ];
      return expect(parseSyndicationFeed(wordpressComRSS)).to.eventually.deep.equal(expectedItems);
    });
  });
});

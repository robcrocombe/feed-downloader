import newPostNotification from './mocks/sns-mocks';

const expect = global.expect;

//
// Makes heavy use of proxied newPostNofication module, which has its AWS
// import mocked by proxyquire.
//
// The message id returned by this proxied object is used to determine that
// the correct type of message has been sent on to AWS from the test.
//

describe('notify-of-new-blogs', () => {
  describe('notifyOfNewBlogs()', () => {
    it('should throw if no blog updates provided', () =>
      expect(() => newPostNotification([])).to.throw('Valid array of users with new posts required')
    );

    it('should throw if non-array passed as parameter', () =>
      expect(() => newPostNotification('notAnArray')).to.throw('Valid array of users with new posts required')
    );

    it('should post correct message for a single new post', () =>
      expect(newPostNotification([
        {
          firstName: 'Danny',
          lastName: 'Brown',
          newPosts: [
            { title: 'The new CS Blogs platform!' }
          ]
        }
      ])).to.eventually.equal(1)
    );

    it('should post correct message for 2 posts by one author', () =>
      expect(newPostNotification([
        {
          firstName: 'Danny',
          lastName: 'Brown',
          newPosts: [
            { title: 'Graduating from York' },
            { title: 'HackTrain 2.0' }
          ]
        }
      ])).to.eventually.equal(2)
    );

    it('should post correct message for >2 posts by one author', () =>
      expect(newPostNotification([
        {
          firstName: 'Danny',
          lastName: 'Brown',
          newPosts: [
            { title: 'Graduating from York' },
            { title: 'HackTrain 2.0' },
            { title: 'Centre for Computing History' }
          ]
        }
      ])).to.eventually.equal(3)
    );

    it('should post correct message for multiple posts by 2 authors', () =>
      expect(newPostNotification([
        {
          firstName: 'Danny',
          lastName: 'Brown',
          newPosts: [
            { title: 'Graduating from York' },
            { title: 'HackTrain 2.0' }
          ]
        },
        {
          firstName: 'Rob',
          lastName: 'Crocombe',
          newPosts: [
            { title: 'Readability: Slack vs HipChat' },
            { title: 'A walk through blog technologies' }
          ]
        }
      ])).to.eventually.equal(4)
    );

    it('should post correct message for multiple posts by >2 authors', () =>
      expect(newPostNotification([
        {
          firstName: 'Danny',
          lastName: 'Brown',
          newPosts: [
            { title: 'Graduating from York' },
            { title: 'HackTrain 2.0' }
          ]
        },
        {
          firstName: 'Alex',
          lastName: 'Pringle',
          newPosts: [
            { title: 'Cycling out of the north' },
            { title: 'Touring the North' },
            { title: 'End Of The Tour' }
          ]
        },
        {
          firstName: 'Rob',
          lastName: 'Crocombe',
          newPosts: [
            { title: 'Readability: Slack vs HipChat' },
            { title: 'A walk through blog technologies' }
          ]
        }
      ])).to.eventually.equal(5)
    );
  });
});

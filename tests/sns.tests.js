 import newPostNotification from '../src/notifications/sns';

 describe('sns', () => {
   describe('notifyOfBlogUpdatesSNS()', () => {
     it('should post correct message for a single new post', done => {
       newPostNotification([
         {
           firstName: 'Danny',
           lastName: 'Brown',
           newPosts: [
             { title: 'The new CS Blogs platform!' }
           ]
         }
       ])
         .then(() => done())
         .catch(done);
     });

     it('should post correct message for multiple posts by one author', done => {
       newPostNotification([
         {
           firstName: 'Danny',
           lastName: 'Brown',
           newPosts: [
             { title: 'Graduating from York' },
             { title: 'HackTrain 2.0' }
           ]
         }
       ])
         .then(() => done())
         .catch(done);
     });

     it('should post correct message for multiple posts by multiple authors', done => {
       newPostNotification([
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
       ])
        .then(() => done())
        .catch(done);
     });
   });
 });

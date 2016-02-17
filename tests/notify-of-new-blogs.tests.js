 import newPostNotification from '../src/notifications/notify-of-new-blogs';

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

     it('should post correct message for 2 posts by one author', done => {
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

     it('should post correct message for >2 posts by one author', done => {
       newPostNotification([
         {
           firstName: 'Danny',
           lastName: 'Brown',
           newPosts: [
             { title: 'Graduating from York' },
             { title: 'HackTrain 2.0' },
             { title: 'Centre for Computing History' }
           ]
         }
       ])
         .then(() => done())
         .catch(done);
     });

     it('should post correct message for multiple posts by 2 authors', done => {
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

     it('should post correct message for multiple posts by >2 authors', done => {
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
       ])
        .then(() => done())
        .catch(done);
     });
   });
 });

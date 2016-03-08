import proxyquire from 'proxyquire';

export const notifyWorkingSNS = proxyquire('../../src/notifications/notify-of-new-blogs', {
  'aws-sdk': {
    SNS: function SNS() {
      return {
        publish: function publish({ TargetArn, Subject, Message }, callback) {
          if (Subject.endsWith(' published a new blog post')) {
            callback(null, { MessageId: 1 });
          }

          if (Subject.endsWith(' new blog posts') && !Message.startsWith('Including:')) {
            callback(null, { MessageId: 2 });
          }

          if (Subject.endsWith(' new blog posts') && Message.startsWith('Including:')) {
            callback(null, { MessageId: 3 });
          }

          if (Subject.endsWith(' authors') && Message.startsWith('Written by')) {
            callback(null, { MessageId: 4 });
          }

          if (Subject.endsWith(' authors') && Message.startsWith('Including posts by')) {
            callback(null, { MessageId: 5 });
          }
        }
      };
    }
  }
}).default;

export const notifyErroringSNS = proxyquire('../../src/notifications/notify-of-new-blogs', {
  'aws-sdk': {
    SNS: function SNS() {
      return {
        publish: function publish({ TargetArn, Subject, Message }, callback) {
          callback(new Error('Simulated Error'), null);
        }
      };
    }
  }
}).default;

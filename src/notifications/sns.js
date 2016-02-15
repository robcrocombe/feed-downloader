import AWS from 'aws-sdk';
import config from '../../config/config.json';
import log from '../log';

AWS.config.update(config.AWS.credentials);

function publishToNewPostTopic(subject, message) {
  return new Promise((resolve, reject) => {
    const sns = new AWS.SNS();
    sns.publish({
      TargetARN: config.AWS.SNS.newPostARN,
      Subject: subject,
      Message: message
    }, (error, data) => {
      if (error) {
        log.error({ error }, 'Error publishing to new post SNS topic');
        reject(error);
      } else {
        resolve(data.MessageId);
      }
    });
  });
}

export default function notifyOfBlogUpdatesSNS() {
  return publishToNewPostTopic('', '');
}

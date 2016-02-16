import AWS from 'aws-sdk';
import config from '../../config/config.json';
import log from '../log';

AWS.config.update(config.AWS.credentials);

function publishToNewPostTopic(subject, message) {
  return new Promise((resolve, reject) => {
    const sns = new AWS.SNS();
    sns.publish({
      TargetArn: config.AWS.SNS.newPostARN,
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

export default function notifyOfBlogUpdatesSNS(usersToNewPosts) {
  return new Promise(() => {
    if (usersToNewPosts.length === 1) {
      const singleAuthor = usersToNewPosts[0];
      switch (singleAuthor.newPosts.length) {
        case 1:
          return publishToNewPostTopic(`${singleAuthor.firstName} ${singleAuthor.lastName} published a new blog post`,
                                        singleAuthor.newPosts[0].title);
        default:
          return publishToNewPostTopic(`${singleAuthor.firstName} ${singleAuthor.lastName} published ${singleAuthor.newPosts.length} new blog posts`,
                                       `Including: "${singleAuthor.newPosts[0].title}" and "${singleAuthor.newPosts[1].title}"`);
      }
    }

    const numberOfNewPosts = 3; // TODO: Determine number of new posts (array.reduce)
    return publishToNewPostTopic(`Read ${numberOfNewPosts} new posts by ${usersToNewPosts.length} authors`,
                                 `Including posts by ${usersToNewPosts[0].firstName} ${usersToNewPosts[0].lastName} and ${usersToNewPosts[1].firstName} ${usersToNewPosts[1].lastName}`);
  });
}

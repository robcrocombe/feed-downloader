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

export default function notifyOfNewBlogs(usersToNewPosts) {
  return new Promise(() => {
    // TODO: throw if usersToNewPosts isnt a list or is of length 0

    if (usersToNewPosts.length === 1) {
      const singleAuthor = usersToNewPosts[0];
      if (singleAuthor.newPosts.length === 1) {
        return publishToNewPostTopic(`${singleAuthor.firstName} ${singleAuthor.lastName} published a new blog post`,
                                     singleAuthor.newPosts[0].title);
      }

      const intro = singleAuthor.newPosts.length > 2 ? 'Including:' : '';
      return publishToNewPostTopic(`${singleAuthor.firstName} ${singleAuthor.lastName} published ${singleAuthor.newPosts.length} new blog posts`,
                                    `${intro} "${singleAuthor.newPosts[0].title}" and "${singleAuthor.newPosts[1].title}"`);
    }

    const numberOfNewPosts = usersToNewPosts.reduce((total, user) => total + user.newPosts.length, 0);
    const intro = usersToNewPosts.length > 2 ? 'Including posts by' : 'Written by';
    return publishToNewPostTopic(`Read ${numberOfNewPosts} new posts by ${usersToNewPosts.length} authors`,
                                 `${intro} ${usersToNewPosts[0].firstName} ${usersToNewPosts[0].lastName} and ${usersToNewPosts[1].firstName} ${usersToNewPosts[1].lastName}`);
  });
}

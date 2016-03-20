import log from '../log';
import blogPost from '../database/models/blog-post';

export default function filterExistingPosts(blogPostsFromFeed, authorId) {
  blogPost.findAll({
    where: {
      authorId
    },
    order: [
      ['dateUpdated', 'DESC'] // Most recent first
    ]
  })
    .then(blogPostsFromDatabase => {
      log.info({ blogPostsFromDatabase }, 'Retrieved blog posts for author from Database');
    });
}

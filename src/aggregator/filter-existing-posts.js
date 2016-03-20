import log from '../log';
import blogPost from '../database/models/blog-post';
import moment from 'moment';

function isNewBlogPost(post, existingPosts) {
  const existingBlogsMatchingLink = existingPosts.filter(existingPost => existingPost.link === post.link);
  return (existingBlogsMatchingLink.length === 0);
}

function isModifiedBlogPost(post, existingPosts) {
  const existingBlogsMatchingLink = existingPosts.filter(existingPost => existingPost.link === post.link);
  if (existingBlogsMatchingLink.length === 0) {
    return false;
  }

  if (existingBlogsMatchingLink.length === 1) {
    return (moment(existingBlogsMatchingLink[0].dateUpdated) !== post.dateUpdated);
  }

  // More than one post in database with same link. Dodgy?
  log.warn({ post }, 'More than one post in database with this link already');
  return true;
}

export default function filterExistingPosts(blogPostsFromFeed, authorId) {
  return new Promise((resolve, reject) => {
    blogPost.findAll({
      where: {
        authorId
      },
      order: [
        ['dateUpdated', 'DESC'] // Most recent first
      ]
    })
      .then(blogPostsFromDatabase => {
        log.info({ authorId, blogPostsFromDatabase }, 'Retrieved blog posts for author from Database');
        const newBlogPosts = blogPostsFromFeed.filter(post => isNewBlogPost(post, blogPostsFromDatabase));
        const modifiedBlogPosts = blogPostsFromFeed.filter(post => isModifiedBlogPost(post, blogPostsFromDatabase));
        resolve({
          newPosts: newBlogPosts,
          modifiedPosts: modifiedBlogPosts
        });
      })
      .catch(error => {
        log.error({ error, authorId }, 'Error occured querying database for authors existing posts');
        reject(error);
      });
  });
}

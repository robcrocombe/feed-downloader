export default function parseATOMPosts(parsedXML) {
  return parsedXML.feed.entry.map(entry => {
    const blogPost = {
      title: entry.title[0]._,
      // link: entry.link,
      // description: ''
    };
    return blogPost;
  });
}

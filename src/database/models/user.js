import Sequelize from 'sequelize';
import database from '../';

export default database.define('user', {
  id: {
    type: Sequelize.STRING,
    field: 'id',
    primaryKey: true,
    allowNull: false
  },
  authenticationProvider: {
    type: Sequelize.ENUM,
    values: ['github', 'stack_exchange', 'wordpress'],
    field: 'authentication_provider',
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name',
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name',
    allowNull: false
  },
  emailAddress: {
    type: Sequelize.STRING,
    field: 'email_address',
    allowNull: false
  },
  profilePicture: {
    type: Sequelize.STRING,
    field: 'profile_picture',
    allowNull: false
  },
  bio: {
    type: Sequelize.TEXT,
    field: 'bio',
    allowNull: false
  },
  websiteURI: {
    type: Sequelize.STRING,
    field: 'website_uri'
  },
  blogURI: {
    type: Sequelize.STRING,
    field: 'blog_uri'
  },
  blogFeedURI: {
    type: Sequelize.STRING,
    field: 'blog_feed_uri'
  },
  cvURI: {
    type: Sequelize.STRING,
    field: 'cv_uri'
  },
  linkedInURI: {
    type: Sequelize.STRING,
    field: 'linkedin_uri'
  },
  githubUsername: {
    type: Sequelize.STRING,
    field: 'github_username'
  },
  twitterUsername: {
    type: Sequelize.STRING,
    field: 'twitter_username'
  }
});

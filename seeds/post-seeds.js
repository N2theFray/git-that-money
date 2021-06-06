const { Post } = require('../models');

const postdata = [
  {
    title: 'make sure this is in resume',
    post_content: 'job content',
    progress: 'contact',
    user_id: 1
  }
  
];

const seedPosts = () => Post.bulkCreate(postdata);

module.exports = seedPosts;
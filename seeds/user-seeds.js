const { User } = require('../models');

const userdata = [
  {
    username: 'n2thefray',
    email: 'blacksteven1@gmail.com',
    password: 'password123'
  }
  
];

const seedUsers = () => User.bulkCreate(userdata, {individualHooks: true});

module.exports = seedUsers;
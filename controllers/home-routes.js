const router = require('express').Router();
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// get all posts for homepage
router.get('/', (req, res) => {
  
  Post.findAll({
    attributes: [
      'id',
      'post_content',
      'title',
      'created_at',
      
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      
      res.render('homepage.handlebars', {
        posts,
        loggedIn: req.session.loggedIn
        ,home: true
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'created_at',
      'post_content'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });
      
      // pass data to template
      res.render('single-post.handlebars', {
          post,
          loggedIn: req.session.loggedIn
          ,home: true
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  res.render('login.handlebars', {
    login: true
  });
});

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
   cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000}
}).single('myResume');

router.get('/signup', (req,res) => {
  res.render('signup.handlebars', {
    login: true
  })
})

router.get('/upload', (req, res) => {
  res.render('index.ejs', {
    login:  true
  })
})

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index.ejs', {
        msg: err
      });
    } else {
      console.log(req.file);
      res.send('Upload Successful!');
    }
  })
})



module.exports = router;
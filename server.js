const path = require('path');
const express = require('express');
const session = require('express-session');
const multer = require("multer");
const ejs = require("ejs");
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers')
var engines = require('consolidate');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const hbs = exphbs.create({ helpers });

app.set('view engine', 'ejs');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));



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


sequelize.sync({ force: false }).then(() => {

  app.listen(PORT, () => console.log('Now listening'));
});

const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const flash=require('connect-flash');
const session=require('express-session');
const config=require('./config/database');
const passport=require('passport');

mongoose.connect(config.database);

let db=mongoose.connection;

db.once('open', function(){
    console.log('connected to db');
});

db.on('error', function(err){
    console.log(err);
});

//init
const app=express();

//models
let Article=require('./models/article');

//load view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

app.use(require('connect-flash')());
app.use(function(req, res, next){
    res.locals.messages=require('express-messages')(req, res);
    next();
});

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user=req.user||null;
    next();
});

app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }
        else{
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });  
});

let articles=require('./routes/articles');
let users=require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

//start server
app.listen(8000, function(){
    console.log('server started on port 8000');
});
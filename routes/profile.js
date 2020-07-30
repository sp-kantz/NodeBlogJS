const express = require('express');
const router = express.Router();

let Article=require('../models/article');
let User=require('../models/user');
let Comment=require('../models/comment');

router.get('/', ensureAuth, function(req, res){
    if(!req.user._id){
        req.flash('danger', 'Please Login');
        res.redirect('/login');
    }
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err);
            return;
        }
        else{
            let query1={user_id:req.user._id}
            Article.find(query1).sort([['created_at', -1]]).exec(function(err, articles){
                let query2={user_id:req.user._id}
                Comment.find(query2).sort([['created_at', -1]]).exec(function(err, comments){
                    res.render('profile', {
                        articles:articles,
                        author:user.name,
                        comments:comments
                    });
                });
            });
        }
    });
});

function ensureAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports=router;
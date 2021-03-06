const express = require('express');
const { body, validationResult } = require('express-validator');
const passport=require('passport');
const router = express.Router();

let Article=require('../models/article');
let User=require('../models/user');
let Comment=require('../models/comment');

router.post('/add', [
    body('title', 'Title is required').notEmpty(),
    body('body', 'Body is required').notEmpty() ], function(req, res){
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('add_article',{title:'Add Article', errors:errors});
    }
    else{
        let article=new Article();
        article.title=req.body.title;
        article.user_id=req.user._id;
        article.username=req.user.name;
        article.body=req.body.body;
        article.created_at=new Date();

        article.save(function(err){
            if(err){
                console.log(err);
                return;
            }
            else{
                req.flash('success', 'Article added');
                res.redirect('/');
            }
        });
    }
});

router.get('/add', ensureAuth, function(req, res){
    res.render('add_article', {
        title: 'Add Article'
    });
});

router.get('/edit/:id', ensureAuth, function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(article.user_id!=req.user.id){
            req.flash('danger', 'Not authorized');
            res.redirect('/');
        }
        else{
            res.render('edit_article', {
                title:'Edit Article',
                article:article
            });
        }
    });
});

router.post('/edit/:id', function(req, res){
    let article={};
    article.title=req.body.title;
    article.user_id=req.user.id;
    article.username=req.user.name;
    article.body=req.body.body;

    let query={_id:req.params.id}

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            req.flash('success', 'Article updated');
            res.redirect('/');
        }
    });
});

router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query={_id:req.params.id}

    Article.findById(req.params.id, function(err, article){
        if(article.author!=req.user._id){
            res.status(500).send();
        }
        else
        {
            Article.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(err){
            console.log(err);
            return;
        }
        else{
            User.findById(article.user_id, function(err, user){
                let query={article:req.params.id}
                Comment.find(query).sort([['created_at', -1]]).exec(function(err, comments){
                    res.render('article', {
                        article:article,
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
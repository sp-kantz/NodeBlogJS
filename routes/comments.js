const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/comment');

router.post('/add/:id', [body('comment', 'Empty comment').notEmpty()], function(req, res){

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        res.render('articles/'+req.article._id, {errors:errors});
    }
    else
    {
        let comment=new Comment();
        comment.user_id=req.user._id;
        comment.username=req.user.name;
        comment.text=req.body.comment;
        comment.article=req.params.id;
        comment.created_at=new Date();

        comment.save(function(err){
            if(err){
                console.log(err);
                return;
            }
            else{
                req.flash('success', 'Comment added');
                res.redirect('/articles/'+req.params.id);
            }
        });
    }
});

router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query={_id:req.params.id}

    Comment.findById(req.params.id, function(err, comment){
        if(comment.user_id!=req.user._id){
            res.status(500).send();
        }
        else
        {
            Comment.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

module.exports=router;
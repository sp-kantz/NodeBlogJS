const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const router = express.Router();
const passport = require('passport');

let User=require('../models/user');
const { route } = require('./articles');

router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', [body('name', 'Name is required').notEmpty(),
body('email', 'Email is required').isEmail(),
body('username', 'Username is required').notEmpty(),
body('password', 'Password is required').notEmpty(),
body('password2', 'Password confirmation is required').notEmpty()
     ], function(req, res){

        const errors = validationResult(req);

        const pswd=req.body.password;
        const pswd2=req.body.password2;

        if(pswd!=pswd2){
            errors.errors.push({
                value: '',
                msg: 'Passwords do not match',
                param: 'password2',
                location: 'body'
              });
        }

        if(!errors.isEmpty()){
            res.render('register',{errors:errors.errors});
        }
        else{
            let newUser= new User({
                name:req.body.name,
                email:req.body.email,
                username:req.body.username,
                password:req.body.password
            });

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(newUser.password, salt, function(err, hash){
                    if(err){
                        console.log(err);
                    }
                    else{
                        newUser.password=hash;
                        newUser.save(function(err){
                            if(err){
                                console.log(err);
                                return;
                            }
                            else{
                                req.flash('success', 'Registered Successfully');
                                res.redirect('/users/login');
                            }
                        });
                    }
                });
            });
        }
});

router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged out');
    res.redirect('/users/login');
});

module.exports=router;
var express = require('express');
var router = express.Router();
//mongo & mongoose setup
var mongoUrl = "mongodb://localhost:27017/coffee";
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);
//----- end of db setup

//Include models
var Account = require('../models/account');

//------ end of models

var bcrypt = require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        page: 'register'
    });
});

router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    var createDate = new Date();
    var modifiedDate = new Date();

    if (password == password2) {
        var hashedPassword = bcrypt.hashSync(password);
        var newAccount = new Account({
            username: username,
            password: hashedPassword,
            email: email,
            createDate: createDate,
            modifiedDate: modifiedDate
        });
        newAccount.save(); //insert to db
        req.session.username = username; //create session cookieParser
        res.redirect('/order');
    } else {
        //passwords don't match.  send error message and back to register page
        res.redirect('/register?failure=password');
    }
});

router.get('/order', function(req, res, next) {
    res.render('order', {
        username: req.session.username,
        page: 'order'
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        page: 'login'
    });
});
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    //query mongo
    Account.findOne({
            username: username
        },
        function(err, docFound) {
          console.log(err);
          console.log(docFound);
            if (docFound !== null) {
                var passwordsMatch = bcrypt.compareSync(password, docFound.password); //returns boolean
                console.log("password match = " + passwordsMatch);
                if (passwordsMatch) {
                    req.session.username = username;
                    res.render('/order', {orderpage: true});
                }
            }
            res.redirect('/login?failure=invalid-login');

        });
});









module.exports = router;

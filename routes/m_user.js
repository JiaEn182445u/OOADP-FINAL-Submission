const express = require('express');
const router = express.Router();
const User = require('../models/aUser');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');


// Login Form POST => /user/login
router.post('/m_login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/showRegisters', // Route to /video/listVideos URL
        failureRedirect: '/showLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
});


// User register URL using HTTP post => /user/register
router.post('/m_register', (req, res) => {

    let errors = [];
    // Retrieves fields from register page from request body
    let { name, email, password, password2 } = req.body;
    let type = "muser";

    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    };
    if (errors.length > 0) {
        res.render('user/m_register', {
            errors,
            name,
            email,
            password,
            password2,
            type,
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('user/m_register', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        password,
                        password2,
                        type,
                    })
                } else {
                    // Encrypt the password
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(password, salt);
                    password = hashedPassword;

                    // Create new user record
                    User.create({ name, email, password, type })
                        .then(user => {
                            alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/sshowRegister');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});


router.post('/m_register', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
    const title = 'I\'m at the user router!';
    res.render('index', { title: title }) // renders views/index.handlebars
});

module.exports = router; 
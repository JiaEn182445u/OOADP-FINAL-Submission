const express = require('express');
const router = express.Router();
const User = require('../models/aUser');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const ensureAuthenticated = require("../helpers/auth")
var nodemailer = require('nodemailer');



// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    // randomPass = Math.random().toString(36).replace('0.', '')
    // console.log(randomPass)

    passport.authenticate('local', {
        successRedirect: '/user/profile/:id', // Route to /video/listVideos URL
        failureRedirect: '/staffLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
});

     
function checkWho(takeFirst) {
    typeSet = false;
    if (takeFirst == "D" || takeFirst == "d") {
        typeSet = "delMan"
        // return typeSet
    }
    if (takeFirst == "A" || takeFirst == "a") {
        typeSet = "admin"
    }
    
        // typeSet = false;
    
    return typeSet
}



router.post('/register', (req, res) => {

    let errors = [];
    // Retrieves fields from register page from request body
    let { staffNo, email } = req.body;
    let password = Math.random().toString(36).replace('0.', '0');
    console.log(password)
    var takeFirst = staffNo.slice(0, 1);
    let type = checkWho(takeFirst)
    
    // let cRegion = checkRegion(type);

    if(typeSet == false){
        console.log('not true');
        errors.push({ text: 'Invalid Staff Number' });
      }

    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            staffNo,
            email,
            password,
            type
        });

    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { staffNo: req.body.staffNo } })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('user/register', {
                        error: user.staffNo + ' already registered',
                        staffNo,
                        email,
                        password,
                        // cRegion,
                        type
                    });
                } else {
                    // Encrypt the password
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(password, salt);
                    password = hashedPassword;

                    // Create new user record
                    User.create({ staffNo, email, password, type })
                        .then(user => {

                            var transporter = nodemailer.createTransport("SMTP",{
                                service: 'gmail',
                                auth: {
                                    user: 'projectmail20002001@gmail.com',
                                    pass: 'ProjectMail2000()'
                                }
                                });
    
                                var mailOptions = {
                                from: 'projectmail20002001@gmail.com',
                                to: '182979j@mymail.nyp.edu.sg',
                                // to: 'jiaenlau.lau@gmail.com',
                                subject: 'Temporary Password',
                                text: '123'
                                };
    
                                transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                                });
    
                            alertMessage(res, 'success', user.staffNo + ' added. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/staffRegister');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});


    

    router.get('/profile/:id', (req, res) =>{

        res.render('user/profile');
    });
    
    router.get('/editProfile/:id', (req, res) =>{
    
        res.render('user/editProfile');
    });
    
    
    router.put('/editProfile/:id', (req, res) => {
    
        // Retrieves fields from register page from request body
        // let {staffName, phoneNo, email, profImg} = req.body;
        // let profileURL=req.body.profileURL;
        let staffName = req.body.staffName;
        let phoneNo=req.body.phoneNo;
        let email=req.body.email;
        let posterURL=req.body.posterURL;
        var user=req.params.id;
        User.update({
            staffName,
            phoneNo,
            email,
            posterURL
        }, {
            where: {
                id: user
            }
        }).then(() => {
            res.redirect('/user/profile/:id');
        }).catch(err => console.log(err));
                
    });

    router.get('/changePassword/:id', ensureAuthenticated,(req, res) => {

    res.render('user/changePass');
});

router.post('/editPassword/:id', (req, res) => {

    // Retrieves fields from register page from request body
    // let {staffName, phoneNo, email, profImg} = req.body;
    // let profileURL=req.body.profileURL;
    let password = req.body.password
    let password1 = req.body.password1
    let password2 = req.body.password2;
    var salt = bcrypt.genSaltSync(10);
    console.log("htttpppww")
    User.findOne({
        where: {
            id: req.params.id
        }
    }) .then(user => {
        console.log('test123')
        console.log(user.password)
            if (user.password == password) {
                if (password1 == password2) {
                    User.update({
                        password: password1
                    }, {
                            where: {
                                id: user
                            }
                        }).then(() => {
                            res.redirect('/user/profile/'+user);
                        }).catch(err => console.log(err));

                }
            }
        })
    });
    
    router.post('/upload', ensureAuthenticated, (req, res) => {
        // Creates user id directory for upload if not exist
        
        if (!fs.existsSync('./public/uploads/' + req.user.id)) {
            fs.mkdirSync('./public/uploads/' + req.user.id);
           
        }
    
        upload(req, res, (err) => {
            if (err) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                if (req.file === undefined) {
                    res.json({ file: '/img/no-image.jpg', err: err });
                } else {
                    res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
                }
            }
        });
    })

router.post('/register', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
    const title = 'I\'m at the user router!';
    res.render('index', { title: title }) // renders views/index.handlebars
});

module.exports = router;
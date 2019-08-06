const express = require('express');
const router = express.Router();
const User = require('../models/aUser');
const feedback = require('../models/feedback');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const ensureAuthenticated = require('../helpers/auth');
const passport = require('passport');
const fs = require('fs');
const upload = require('../helpers/feedbackUpload');
const orderd = require('../models/order_detail');
const payment = require('../models/payment');
const cart = require('../models/cart');
const shopIt = require('../models/stockRecord');
const ohistory = require('../models/orderhistory');
const hbs=require('../helpers/hbs');
// Login Form POST => /user/login
router.post('/clogin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/chome', // Route to /video/listVideos URL
        failureRedirect: '/', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
}); 


// User register URL using HTTP post => /user/register
router.post('/cregister', (req, res) => {

    let errors = [];
    // Retrieves fields from register page from request body
    let { name, gender, email,contact,address,postalcode,password, password2 } = req.body;
    let profileURL=req.body.posterProfile;
    let type="cuser";
    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('cuser/cregister', {
            errors,
            name,
            email,
            gender,
            contact,
            address,
            postalcode,
            password,
            password2,
            type,
            profileURL
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('cuser/cregister', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        gender,
                        contact,
                        address,
                        postalcode,
                        password,
                        password2,
                        type,
                        profileURL
                    });
                } else {
                    // Encrypt the password
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(password, salt);
                    password = hashedPassword;

                    // Create new user record
                    User.create({ name, email,gender,contact,address, postalcode,password,profileURL,type })
                        .then(user => {
                            alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});


router.post('/cregister', (req, res) => {
    req.logout();
    res.redirect('/');
});



router.get('/profile/:id', (req, res) => {
    // var old=docu
    ohistory.findAll(
		{
			where: {
				CuserId: req.user.id
            },
            order: [
				['id', 'DESC']
			]
		})
		.then((history) => {
res.render('user/customerprofile', { //passing the videos object to display all the videos retrieved.
   history:history
});
});
});


   

router.get('/profileEdit',(req,res)=>{
   res.render('user/updateinfo') 
});

router.put('/saveeditedcregister/:id', (req, res) => {

    // Retrieves fields from register page from request body
    let { gender,contact,address,posterURL ,postalcode} = req.body;
    let profileURL=req.body.posterURL;
    // let profileURL=req.body.profileURL;
    let userId=req.params.id;
    User.update({
        gender,
        contact,
        address,
        profileURL,
        postalcode
    }, {
        where: {
            id: userId
        }
    }).then(() => {
        res.redirect('/cuser/profile/'+userId);
    }).catch(err => console.log(err));
            
});
router.get('/changepassword',(req,res)=>{
    res.render('user/changepassword') 
 });


router.put('/savenewpassword/:id', (req, res) => {
    // Retrieves fields from register page from request body
    // let profileURL=req.body.profileURL;
    let userId=req.params.id;
    let password=req.body.password;
    let password2=req.body.password2;
    let password3=req.body.password3;

    passport.authenticate('local', {
        // successRedirect: '/', // Route to /video/listVideos URL
        // failureRedirect: '/cLogin', // Route to /login URL
        // failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
        if(password2=password3){
                    let password=password2;
                    User.update({
                        password
                    }, {
                        where: {
                            id: userId
                        }
                    }).then(() => {
                        res.redirect('/');
                    }).catch(err => console.log(err));
                }

    })

    // if(User.password==password){
    //     console.log(User.password);
    //     if(password2==password3){
    //         let password=password2;
    //         User.update({
    //             password
    //         }, {
    //             where: {
    //                 id: userId
    //             }
    //         }).then(() => {
    //             res.redirect('/');
    //         }).catch(err => console.log(err));
    //     }
    //     else{
    //         console.log("new and confirm not sameeeeeeeeeeeeeeeee");
    //         res.redirect('/');
    //     }
        
    // }
    // else{
    //     console.log("old and password not sameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    //     res.redirect('/');
    // }
    
            
});

// router.post('/uploadprofilepic', ensureAuthenticated, (req, res) => {
//     // Creates user id directory for upload if not exist
//     if (!fs.existsSync('./public/profilepic/' + req.user.id)) {
//         fs.mkdirSync('./public/profilepic/' + req.user.id);
//         console.log("hehe111111111");
//     }
//     upload(req, res, (err) => {
//         if (err) {
//             res.json({ file: '/img/profile.png', err: err });
//             console.log("hehe22222222");
//         } else {
//             if (req.file === undefined) {
//                 res.json({ file: '/img/profile.png', err: err });
//                 console.log("hehe333333333");
//             } else {
//                 res.json({ file: `/profilepic/${req.user.id}/${req.file.filename}` });
//                 console.log("hehe4444444444 naruto");
//             }
//         }
//     });
// })



// router.post('/upload', ensureAuthenticated, (req, res) => {
//     // Creates user id directory for upload if not exist
//     if (!fs.existsSync('./public/profilepic/' + req.user.id)) {
//         fs.mkdirSync('./public/profilepic/' + req.user.id);
//     }

//     upload(req, res, (err) => {
//         if (err) {
//             res.json({ file: '/img/profile.png', err: err });
//         } else {
//             if (req.file === undefined) {
//                 res.json({ file: '/img/profile.png', err: err });
//             } else {
//                 res.json({ file: `/profilepic/${req.user.id}/${req.file.filename}` });
//             }
//         }
//     });
// })

router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist

    if (!fs.existsSync('./public/feedbackP/' + req.user.id)) {
        fs.mkdirSync('./public/feedbackP/' + req.user.id);
        
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/feedbackP/${req.user.id}/${req.file.filename}` });
            }
        }
    });
})

module.exports = router;
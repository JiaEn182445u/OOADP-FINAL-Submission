const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const feedback = require('../models/Feedback');
const ensureAuthenticated = require('../helpers/auth');
const moment = require('moment');
const fs = require('fs');
const upload = require('../helpers/feedbackUpload');
const user=require('../models/aUser');
const orderd = require('../models/order_detail');
const shopIt = require('../models/stockRecord');

router.get('/messageemail',(req,res)=>{
   
    orderd.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
                
                model: shopIt, as: "stockrec",
				required: true
			}]
        })
		.then((order) => {
           
            var listname=[];
            var listid=[];
            for(var i=0;i<order.length;i++)
            {
                listname.push(shopIt.itemName);
            }
          
	res.render('customerfeedback/messageemail', { 
        order: order
      
})
})
});

router.post('/messageemailsend',ensureAuthenticated, (req, res) => {
	// let emailfeedback = req.user.email;
    let emailfeedback = req.body.emailfeedback;
    let rate=req.body.rate.toString();
    let Message= req.body.Message;
    let DropdownPorS = req.body.PorS.toString();
    
    let DropdownSType=req.body.DropdownSType;
    let imgurl=req.body.posterURL;

    let CuserId = req.user.id;
    if(DropdownPorS=="Product"){
        let productcode=req.body.productcode;
    
    // Multi-value components return array of strings or undefined
    feedback.create({
		emailfeedback,
        DropdownPorS,
        productcode,
		DropdownSType,
        Message,
        imgurl,
        rate,
        CuserId
    }).then((feedback) => {
        alertMessage(res, 'success', 'Your feedback has been sent', 'fa fa-hand-peace-o', true);
        res.redirect('/feedbackk/messageemail');
    })}
    else{
        feedback.create({
            emailfeedback,
            DropdownPorS,
            DropdownSType,
            Message,
            imgurl,
            rate,
            CuserId
        })
        .then((feedback) => {
            alertMessage(res, 'success', 'Your feedback has been sent', 'fa fa-hand-peace-o', true);
				res.redirect('/feedbackk/messageemail');
          
        })
    }
   
});


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
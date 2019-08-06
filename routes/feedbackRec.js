const express = require('express');
const router = express.Router();
const User = require("../models/aUser")
const feedB = require("../models/feedback")
const ensureAuthenticated = require("../helpers/auth")

router.get('/customerFeedbacks', ensureAuthenticated, (req, res) =>{
	
	// User.findAll({
	// 	where: {
	// 		id: req.user.id
	// 	},
	// }).then(feedB.findAll)
		
	// 		// where: {
	// 		// 	id:req.body.id
	// 		// },
			
	// 		// raw: true
	// 	}).then((feedbacks) => {
	// 		res.render('admin/feedbackAdmin', {
	// 			feedbacks: feedbacks
	// 		});
	// 	}).catch(err => console.log(err));
	// })
	feedB.findAll({
	// where: {
	// 	id:req.params.id
	// },
	
	// raw: true
}).then((feedbacks) => {
	res.render('admin/feedbackAdmin', {
		feedbacks: feedbacks
	});
}).catch(err => console.log(err));

});

module.exports = router;
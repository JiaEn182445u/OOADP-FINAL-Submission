const express = require('express');
const router = express.Router();
const User = require("../models/aUser")
const reference = require("../models/reference.js")
const ensureAuthenticated = require("../helpers/auth")
const stockRec = require("../models/stockRecord")


router.get('/viewInstocks', ensureAuthenticated, (req, res) => {
	stockRec.findAll({

	}).then((stockrecs) => {
		res.render('admin/viewInstocks', {
			stockrecs: stockrecs
		});
	}).catch(err => console.log(err));

});


router.get('/deliveryStatusUpdate', ensureAuthenticated, (req, res) => {
	console.log(req.params.id)
	reference.findAll({
		// where: {
		// 	id: req.user.id
		// },

		raw: true
	}).then((forms) => {
		res.render('admin/deliveryStatus', {
			forms: forms
		});
	}).catch(err => console.log(err));

})

router.get('/DaddItemCodeToStock/:itemCode', (req, res) => {
	// insert based on the itemcode
	var itemCode = req.params.itemcode;
	// 
})

router.get('/DStatusUpdate/:id', ensureAuthenticated, (req, res) => {

	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + ' ' + time;
	reference.update({
		arrivedDate: dateTime,
		status: ''
	}, {
			where: {
				id: req.params.id
			},
			// where: {
			// 	id: req.user.id
			// },

			raw: true
		}).then((forms) => {



		})
	reference.findOne({

		where: {
			id: req.params.id
		}
	})

		.then((ref) => {

			stockRec.findOne({
				where: {
					itemCode: ref.itemCode
				}
			})
		.then(stockrec => {
			if (stockrec) {
				console.log("THIS IS FOUNDD")
				stockRec.update({
					quantity: parseInt(stockrec.quantity) + parseInt(ref.quantity)
				}, {
						where: {
							itemCode: ref.itemCode
						}
					})
			}
			
			else {
				console.log("THIS IS NOT FOUND, PLEASE CREATE")
				let itemCode = ref.itemCode;
				let description = ref.description;
				let merchant = ref.merchant;
				let quantity = ref.quantity;
				let arrivedDate = dateTime;
				let itemName = ref.itemName;
				let price = ref.price;
				let referenceNo = ref.referenceNo;
				let posterURL = ref.posterURL;
				let dateofDelivery = ref.dateofDelivery;
				let status = ref.status;
				// if(!stockRec){

				console.log("1243562458");
				stockRec.create({
					itemCode, description, merchant, quantity, arrivedDate, itemName,
					price, referenceNo, posterURL, dateofDelivery, status
				})
					.then(() => {
						res.redirect('/stocks/deliveryStatusUpdate');
					})
					.catch(err => console.log(err));
			}
		})
})
})

module.exports = router;
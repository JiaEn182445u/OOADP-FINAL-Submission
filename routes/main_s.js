const express = require('express');
const router = express.Router();
const deli = require('../models/Delivery');
const alertMessage = require('../helpers/messenger'); //to test flash-messenger
const MySQLStore = require('express-mysql-session');
let config = require('../config/db.js');
const mysql = require('mysql');
const orderItem = require('../models/OrderItem');
const payments = require('../models/payment');
const orderDs = require('../models/order_detail');
const stockRec = require('../models/stockRecord');
const sortDel = require('../models/sortDel');
const sequelize = require('sequelize');
const Cuser = require('../models/aUser');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'vidjot_db',
    username: 'itp211',
    password: 'itp211'
});

// router.get('/delForm', (req, res) => {
//     res.render("enterDb")
// });

// //throw later when db received
// router.post('/enterDb', (req, res) => {
//     let cOrderNo = req.body.cOrderNo; //req.body -> retrieve input form fields
//     let cName = req.body.cName; //Since the story field size in the videos table is 2000, only the first 2000 characters of the input is retrieved
//     let cAddr = req.body.cAddr;
//     let cPostal_Code = req.body.cPostal_Code;
//     let cEmailAddr = req.body.cEmailAddr;
//     let cPhoneNo = req.body.cPhoneNo;
//     let delDate = req.body.deliDate.toString();
//     let delPickUpTime = req.body.delPickUpTime;
//     let delMan = req.body.delMan;
//     let cRegion = req.body.region;

//     if (cName != "") {
//         deli.create({ cOrderNo, cName, cAddr, cPostal_Code, cRegion, cEmailAddr, cPhoneNo, delDate, delPickUpTime, delMan }) //masuk db
//         orderItem.create({ cOrderNo, cName, cRegion, delDate, delPickUpTime })
//         console.log('luar')
//         // .then(deliveries => {
//         //                     // alertMessage(res, 'success', delivery.cName + ' added.', 'fas fa-sign-in-alt', true);
//         //                     console.log('info created')
//         //                     res.redirect('/delivery');
//         //                 })
//         res.redirect('/delivery/delivery')

//     }
//     res.render('enterDb')
// });

// router.get('/', (req, res) => {

//     console.log("teerr");
// });
router.get('/delivery/:filterDone', (req, res) => {
    console.log("tesyert");
    //sortingDel(req);
    var filterDone = req.params.filterDone;
    if (filterDone != "all") {
        var filter = filterDone;

    }
    else {
        filter = "North" & "East" & "North-East" & "West" & "Central"
    }

    console.log(filter);
    payments.findAll({ //retrieves all videos using the userId defined in the where object in ascending order by title.
        where: {
            cRegion: filter,
            //cOrderNo: payments.id,
        },

        raw: true
    }).then((payments) => { //The promise .then((videos) returns a videos object that contains all records retrieved from Video.findAll.

        console.log(payments, 'pay')
        // if (payments != '') {
        res.render('delivery/del_admin', { //passing the videos object to display all the videos retrieved.

            //deliveries: deliveries,
            filterDone: filterDone,
            payments: payments




        })
        // }
        //else {
        //   res.render('delivery/redirectEmpty')
        // }

    }).catch(err => console.log(err));
    //got error

});

// router.get('/Empty', (req, res) => {
//     res.render('delivery/redirectEmpty')
// })


router.get('/del_details/:id', (req, res) => {
    var dMId = req.params.id;
    payments.findOne({
        where: {
            id: dMId
        },
    }).then((payments) => {
        //    console.log("videoIdToDelete.user: " + video.userId);
        //    console.log("req.user.id : " + req.user.id);
        console.log(dMId, "tryyyyyyyyyyyyyyyyyy");
        res.render('delivery/del_details', {
            payments: payments
        })
    })
});

router.put('/updateDelDetails/:id', (req, res) => {

    let delDate = req.body.delDate;
    let delPickUpTime = req.body.delPickUpTime;
    let delMan = req.body.delMan;


    payments.update({
        // Set variables here to save to the videos table
        delDate,
        delPickUpTime,
        delMan
    }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            orderItem.update({
                // Set variables here to save to the videos table
                delDate,
                delPickUpTime,
                delMan
            }, {
                    where: {
                        id: req.params.id
                    }
                })
            res.redirect('/main_s/delivery/all');
        }).catch(err => console.log(err));
});


router.get('/home', (req, res) => {
	var d = new Date();

	//var lastDay = new Date(date.getFullYear(), d.getMonth() + 1, 0);
	//document.getElementById('trying').innerHTML = lastDay;
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var year = d.getFullYear();
	// day = day + i;
	var tmr = day + 1;
	// var tmr2 = day + 2;
	// var tmr3 = day + 3;
	// var tmr4 = day + 4;

	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	if (tmr < 10) {
		tmr = '0' + tmr;
	}
	// if (tmr2 < 10) {
	// 	tmr2 = '0' + tmr2;
	// }
	// if (tmr3 < 10) {
	// 	tmr3 = '0' + tmr3;
	// }
	// if (tmr4 < 10) {
	// 	tmr4 = '0' + tmr4;
	// }

	//i++;
	date1 = day + "/" + month + "/" + year;
	date2 = tmr + "/" + month + "/" + year;
	// date3 = tmr2 + "/" + month + "/" + year;
	// date4 = tmr3 + "/" + month + "/" + year;
    // date5 = tmr4 + "/" + month + "/" + year;
    delMan = "Steven"
    orderDs.findAll({
        include: [{model : stockRec,}, {model: payments, where:{deldate: date1, delMan: delMan}}],

    }).then((order) => {
        payments.findAll({
            // include:[{payments}],
            // where:{
            //     orderid: payments.id,
            // }

        }).then((payments) => {


            // for (i = 0; i < 1000000; i++) {

            // }
            console.log(order, 'bayar');
            res.render('delivery/deliveryHome', {
                // order: order,
                payments: payments,
                order: order
            })
        })
    })
});





router.get('/tomorrow', (req, res) => {
	var d = new Date();

	//var lastDay = new Date(date.getFullYear(), d.getMonth() + 1, 0);
	//document.getElementById('trying').innerHTML = lastDay;
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var year = d.getFullYear();
	// day = day + i;
	var tmr = day + 1;
	// var tmr2 = day + 2;
	// var tmr3 = day + 3;
	// var tmr4 = day + 4;

	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	if (tmr < 10) {
		tmr = '0' + tmr;
	}
	// if (tmr2 < 10) {
	// 	tmr2 = '0' + tmr2;
	// }
	// if (tmr3 < 10) {
	// 	tmr3 = '0' + tmr3;
	// }
	// if (tmr4 < 10) {
	// 	tmr4 = '0' + tmr4;
	// }

	//i++;
	date1 = day + "/" + month + "/" + year;
	date2 = tmr + "/" + month + "/" + year;
	// date3 = tmr2 + "/" + month + "/" + year;
	// date4 = tmr3 + "/" + month + "/" + year;
    // date5 = tmr4 + "/" + month + "/" + year;

    orderDs.findAll({
        include: [{model : stockRec,}, {model: payments, where:{deldate: date2}}],

    }).then((order) => {
        payments.findAll({
            // include:[{payments}],
            // where:{
            //     orderid: payments.id,
            // }

        }).then((payments) => {


            // for (i = 0; i < 1000000; i++) {

            // }
            console.log(order, 'bayar');
            res.render('delivery/deliveryTmr', {
                // order: order,
                payments: payments,
                order: order
            })
        })
    })
});






router.get('/delivering', (req, res) => {
	var d = new Date();

	//var lastDay = new Date(date.getFullYear(), d.getMonth() + 1, 0);
	//document.getElementById('trying').innerHTML = lastDay;
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var year = d.getFullYear();
	// day = day + i;
	var tmr = day + 1;
	// var tmr2 = day + 2;
	// var tmr3 = day + 3;
	// var tmr4 = day + 4;

	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	if (tmr < 10) {
		tmr = '0' + tmr;
	}
	// if (tmr2 < 10) {
	// 	tmr2 = '0' + tmr2;
	// }
	// if (tmr3 < 10) {
	// 	tmr3 = '0' + tmr3;
	// }
	// if (tmr4 < 10) {
	// 	tmr4 = '0' + tmr4;
	// }

	//i++;
	date1 = day + "/" + month + "/" + year;
	date2 = tmr + "/" + month + "/" + year;
	// date3 = tmr2 + "/" + month + "/" + year;
	// date4 = tmr3 + "/" + month + "/" + year;
	// date5 = tmr4 + "/" + month + "/" + year;
    orderDs.findOne({
        include: [{model : stockRec,}, {model: payments, where:{deldate: date1}}],

    }).then((order) => {
        res.render("delivery/startDeliver", {
            order:order
        })
        
    })
});


router.get('/destroy/:id', (req, res) => {
	let theid = req.params.id;
	// Select * from videos where videos.id=videoID and videos.userId=userID
	orderDs.findOne({
		where: {
			orderid: theid,
		},
		// attributes: ['id', 'userId']
	}).then((order) => {

		// if record is found, user is owner of video
		if (order != null) {
			order.destroy({
				where: {
					orderid: theid
				}
			}).then(() => {
                payments.findOne({
                    where: {
                        id: theid,
                    },
                    // attributes: ['id', 'userId']
                }).then((payment) => {
            
                    // if record is found, user is owner of video
                    if (payment != null) {
                        payment.destroy({
                            where: {
                                id: theid
                            }
                        }).then(() => {

				alertMessage(res, 'info', 'Delivery Completed', 'far fa-trash-alt', true);
                res.redirect('/main_s/delivering'); // To retrieve all videos again
			}).catch(err => console.log(err));
        }
    })
    })  
} 
    });
    
});

module.exports = router;
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Delivery = db.define('delivery', {
    cOrderNo: {
        type: Sequelize.STRING
    },
    cName: {
        type: Sequelize.STRING
    },
    cAddr:{
        type: Sequelize.STRING
    },
    cPostal_Code: {
        type: Sequelize.STRING
    },
    cRegion: {
        type: Sequelize.STRING
    },
    cEmailAddr: {
        type: Sequelize.STRING
    },
    cPhoneNo: {
        type: Sequelize.STRING
    },
    delDate: {
        type: Sequelize.STRING
    },
    delPickUpTime: {
        type: Sequelize.STRING
    },
    delMan: {
        type: Sequelize.STRING
    },
});


module.exports = Delivery;

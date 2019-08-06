const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const payment = db.define('payment', {
    totalamount: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.STRING
    },
    time: {
        type: Sequelize.STRING
    },
    payname: {
        type: Sequelize.STRING 
    },
    paycontact: {
        type: Sequelize.STRING
    },
    payemail: {
        type: Sequelize.STRING
    },
    payaddress: {
        type: Sequelize.STRING
    },
    paypostalC: {
        type: Sequelize.STRING
    },
    CorCC: {
        type: Sequelize.STRING
    },
    CCType: {
        type: Sequelize.STRING
    },
    transactions:{ 
        type: Sequelize.STRING
    },
    cRegion:{ 
        type: Sequelize.STRING
    },
    delDate :{
        type: Sequelize.STRING
    },
    delMan:{
        type: Sequelize.STRING
    }
});
module.exports = payment;
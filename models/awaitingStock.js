const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const stockRec = db.define('waitingStock', {
    itemCode: {
        type: Sequelize.STRING
    },
    desc: {
        type: Sequelize.STRING
    },
    merchant:{
        type: Sequelize.STRING
    },
    qtyInStock: {
        type: Sequelize.STRING
    },
    upDate: {
        type: Sequelize.STRING
    }
});
module.exports = stockRec;
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const OrderItems = db.define('OrderItems', {
    cOrderNo: {
        type: Sequelize.STRING
    },
    cName: {
        type: Sequelize.STRING
    },
    cRegion: {
        type: Sequelize.STRING
    },
    delDate: {
        type: Sequelize.STRING
    },
    delPickUpTime: {
        type: Sequelize.STRING
    },
    ItemName: {
        type: Sequelize.STRING
    },
    Quantity: {
        type: Sequelize.STRING
    },
});


module.exports = OrderItems; 
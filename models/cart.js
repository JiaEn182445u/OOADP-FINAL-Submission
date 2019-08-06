const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const cart = db.define('cart', {
    quantity: {
        type: Sequelize.STRING
    },
    remark: {
        type: Sequelize.STRING
    }
});
module.exports = cart; 

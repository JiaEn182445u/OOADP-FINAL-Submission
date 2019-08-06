const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/

const Orderhistory = db.define('Orderhistory', {
    itemName:{
        type:Sequelize.STRING
    }, 
    price:{
       type:Sequelize.DECIMAL
    },
    oquantity: {
        type: Sequelize.STRING
    },
    remark: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.STRING
    }, 
    time: {
        type: Sequelize.STRING
    }, 
    posterURL:{
        type: Sequelize.STRING
    },
    CuserId:{
        type: Sequelize.STRING
    } 
    
});

module.exports = Orderhistory;
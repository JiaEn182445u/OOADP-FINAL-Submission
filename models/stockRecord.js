const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const stockRec = db.define('stockrec', {
    // itemCode: {
    //     type: Sequelize.STRING
    // },
    // desc: {
    //     type: Sequelize.STRING
    // },
    // merchant:{
    //     type: Sequelize.STRING
    // },
    // qtyInStock: {
    //     type: Sequelize.STRING
    // },
    // upDate: {
    //     type: Sequelize.STRING
    // }
    merchant:{
        type:Sequelize.STRING
    },
    itemName:{
        type:Sequelize.STRING
    },
    price:{
       type:Sequelize.DECIMAL
    },
    itemCode: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING(2000)
    },
    quantity: {
        type: Sequelize.STRING
    },
    referenceNo: {
        type: Sequelize.STRING
    },
    dateofDelivery: {
        type: Sequelize.DATE
    },
    posterURL:{

        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    },
    arrivedDate:{
        type: Sequelize.STRING

    }
    
});
module.exports = stockRec;
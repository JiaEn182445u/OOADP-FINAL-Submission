const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const feedback = db.define('feedback', {
    emailfeedback: {
        type: Sequelize.STRING
    },
    DropdownPorS: {
        type: Sequelize.STRING
    },
    productcode:{
        type: Sequelize.STRING
    },
    DropdownSType: {
        type: Sequelize.STRING
    },
    Message: {
        type: Sequelize.STRING
    },
    rate: {
        type: Sequelize.STRING
    },
    imgurl:{
        type: Sequelize.STRING  
    }
});
module.exports = feedback;
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const sortDel = db.define('sortDel', {
    delDate: {
        type: Sequelize.STRING
    },
    order1: {
        type: Sequelize.STRING
    },
    order2: {
        type: Sequelize.STRING
    },
    order3: {
        type: Sequelize.STRING
    },
    delMan: {
        type: Sequelize.STRING
    },
    regionAssigned: {
        type: Sequelize.STRING
    },
});


module.exports = sortDel;

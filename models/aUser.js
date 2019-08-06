const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const User = db.define('user', {
    staffNo: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    staffName: {
        type: Sequelize.STRING
    },
    phoneNo: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    designation: {
        type: Sequelize.STRING
    },
    posterURL: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    contact: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    postalcode: {
        type: Sequelize.STRING
    },
    profileURL:{
        type: Sequelize.STRING
    },
    cRegion:{
        type: Sequelize.STRING
    },
    type:{
        type: Sequelize.STRING
    }

});
module.exports = User; 
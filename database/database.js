//conexao com sequelize

const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'espaco2501',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;

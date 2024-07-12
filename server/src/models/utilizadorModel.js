// models/utilizadorModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Utilizador = sequelize.define('Utilizador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    tokenVerificacao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto : {
        type: DataTypes.STRING,
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'utilizador',
    timestamps: false,
    freezeTableName: true
});



module.exports = Utilizador;

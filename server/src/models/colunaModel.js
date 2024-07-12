const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const { Projeto } = require('./projetoModel');

const Coluna = sequelize.define('Coluna', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idProjeto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'projeto', 
            key: 'id'
        }
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'coluna',
    timestamps: false,
    freezeTableName: true
});

Coluna.belongsTo(Projeto, { foreignKey: 'idProjeto' });
Projeto.hasMany(Coluna, { foreignKey: 'idProjeto' });

module.exports = Coluna;
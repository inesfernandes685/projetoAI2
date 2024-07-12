// models/notaModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Utilizador = require('./utilizadorModel');
const {Projeto} = require('./projetoModel');
const Coluna = require('./colunaModel');

const Nota = sequelize.define('Nota', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    idCriador: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Utilizador,
            key: 'id'
        }
    },
    idColuna: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Coluna,
            key: 'id'
        }
    },
    prioridade: {
        type: DataTypes.ENUM,
        values: ['Casual', 'Importante', 'Urgente'],
        allowNull: true
    },
    idProjeto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Projeto,
            key: 'id'
        }
    }, 
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'nota',
    timestamps: false
});

Nota.belongsTo(Utilizador, { foreignKey: 'idCriador' });
Nota.belongsTo(Projeto, { foreignKey: 'idProjeto' });
Nota.belongsTo(Coluna, { foreignKey: 'idColuna' });

module.exports = Nota;

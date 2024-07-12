    const { DataTypes } = require('sequelize');
    const { sequelize } = require('../utils/database');
    const Utilizador = require('./utilizadorModel');


    const Projeto = sequelize.define('Projeto', {
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
        descricao: {
            type: DataTypes.STRING,
            allowNull: true
        },
        idCriador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'projeto',
        timestamps: false,
        freezeTableName: true
    });

    const ProjetoUtilizador = sequelize.define('ProjetoUtilizador', {
        idProjeto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        idUtilizador: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
        tableName: 'projeto_utilizador',
        timestamps: false,
        freezeTableName: true
    });

    // Define as relações
    Projeto.belongsTo(Utilizador, { foreignKey: 'idCriador' });
    Projeto.belongsToMany(Utilizador, { through: ProjetoUtilizador, foreignKey: 'idProjeto' });
    Utilizador.belongsToMany(Projeto, { through: ProjetoUtilizador, foreignKey: 'idUtilizador' });
    ProjetoUtilizador.belongsTo(Projeto, { foreignKey: 'idProjeto' });
    ProjetoUtilizador.belongsTo(Utilizador, { foreignKey: 'idUtilizador' });

    module.exports = { Projeto, ProjetoUtilizador };
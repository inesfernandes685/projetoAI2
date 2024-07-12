const Utilizador = require('./utilizadorModel');
const Projeto = require('./projetoModel');
const ProjetoUtilizador = require('./projetoUtilizadorModel');
const Nota = require('./notaModel');

// Define associations
Projeto.belongsTo(Utilizador, { foreignKey: 'idUtilizador' });
Utilizador.hasMany(Projeto, { foreignKey: 'idUtilizador' });

Projeto.belongsToMany(Utilizador, { through: ProjetoUtilizador, foreignKey: 'idProjeto' });
Utilizador.belongsToMany(Projeto, { through: ProjetoUtilizador, foreignKey: 'idUtilizador' });

module.exports = {
    Utilizador,
    Projeto,
    ProjetoUtilizador,
    Nota
};
const { sequelize} = require('./database');
const Utilizador = require('../models/utilizadorModel');
const Nota = require('../models/notaModel');
const { Projeto, ProjetoUtilizador } = require('../models/projetoModel');
const Coluna = require('../models/colunaModel');

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com a base de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });
const criarDadosTeste = async () => {
  try {
    // Insira dados de teste para Utilizador
    await Utilizador.create({
      nome: 'Utilizador Comum',
      email: 'teste@mail.com',
      password: '$2a$10$wWPlEIBW0ZAdgPrG39mQW.h6uEqKssgpZbZxN7eRzTRQIpRkFfD2u',
      estado: true,
    });

    await Utilizador.create({
      nome: 'Admin',
      email: 'admin@mail.com',
      password: '$2a$10$wWPlEIBW0ZAdgPrG39mQW.h6uEqKssgpZbZxN7eRzTRQIpRkFfD2u',
      estado: true,
      isAdmin: true
    });

    // Insira dados de teste para Projeto
    await Projeto.create({
      nome: 'Projeto Teste',
      descricao: 'Descrição do projeto teste',
      idCriador: 1,
    });

    await ProjetoUtilizador.create({
      idProjeto: 1,
      idUtilizador: 1
    });
    await ProjetoUtilizador.create({
      idProjeto: 1,
      idUtilizador: 2
    });

    await Coluna.create({
      nome: 'Por Começar',
      idProjeto: 1
    });

    await Coluna.create({
      nome: 'Em processo',
      idProjeto: 1
    });

    await Coluna.create({
      nome: 'Quase Terminado',
      idProjeto: 1
    });

    await Coluna.create({
      nome: 'Terminado',
      idProjeto: 1
    });

    await Nota.create({
      titulo: 'Iniciar Implementação',
      descricao: 'Fazer os protótipos e começar a implementação',
      idCriador: 1,
      idColuna: 1,
      idProjeto: 1,
      prioridade: 'Importante', 
      data: '2024-07-17'
    });

    await Nota.create({
      titulo: 'Terminar protótipos',
      descricao: 'Acabar página de login e registo',
      idCriador: 1,
      idColuna: 1,
      idProjeto: 1,
      prioridade: 'Urgente',
      data: '2024-07-19'
    });

    await Nota.create({
      titulo: 'Apresentar projeto',
      descricao: 'Referir os pontos mais importantes do projeto',
      idCriador: 1,
      idColuna: 2,
      idProjeto: 1,
      prioridade: 'Casual',
      data: '2024-07-15'
    });

    await Nota.create({
      titulo: 'Implementar página de login',
      descricao: 'Implementar página de login com autenticação',
      idCriador: 1,
      idColuna: 4,
      idProjeto: 1,
      prioridade: 'Casual',
      estado: true,
    });


    console.log('Dados de teste inseridos com sucesso');
  } catch (error) {
    console.error('Erro ao inserir dados de teste:', error);
  }
};

const sincronizarTabelas = async () => {
  try {
    await Utilizador.sync({ force: true });
    await Projeto.sync({ force: true });
    await Coluna.sync({ force: true });
    await Nota.sync({ force: true });
    await ProjetoUtilizador.sync({ force: true });

    console.log('Tabelas sincronizadas');

    // Chame a função para criar dados de teste após a sincronização
    await criarDadosTeste();
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  }
};

module.exports = sincronizarTabelas;
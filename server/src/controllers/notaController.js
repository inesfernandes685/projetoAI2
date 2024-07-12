const Nota = require('../models/notaModel');
const {Projeto, ProjetoUtilizador} = require('../models/projetoModel');

exports.getNotasProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const { idColuna } = req.query;
    const whereClause = {
      idProjeto: id,
    };
    if (idColuna) {
      whereClause.idColuna = idColuna;
    }
    const notas = await Nota.findAll({
      where: whereClause,
    });
    res.send(notas);
  } catch (error) {
    console.error('Erro ao listar notas:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.getNota = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await Nota.findByPk(id);

    if (!nota) {
      return res.status(404).send({ error: 'Nota não encontrada' });
    }

    res.send(nota);
  } catch (error) {
    console.error('Erro ao obter nota:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.criarNota = async (req, res) => {
  const { titulo, descricao, data, idColuna, prioridade, idProjeto } = req.body;
  const idCriador = req.user.id;

  console.log("Dados recebidos:", { titulo, descricao, data, idColuna, prioridade, idProjeto, idCriador });

  if (!idColuna || !idProjeto || !idCriador) {
    console.error("Dados incompletos ou inválidos", { idColuna, idProjeto, idCriador });
    return res.status(400).json({ error: 'Dados incompletos ou inválidos' });
  }

  const descricaoNota = descricao || null;
  const dataNota = data === "" ? null : data;

  try {
    const novaNota = await Nota.create({
      titulo,
      descricao: descricaoNota,
      data: dataNota,
      idCriador,
      idColuna,
      idProjeto
    });
    res.json(novaNota);
  } catch (error) {
    console.error("Erro ao criar nota", error);
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarNota = async (req, res) => {
  const { id } = req.params; 
  const { idColuna, titulo, descricao, prioridade, estado, data} = req.body; 

  try {
      let nota = await Nota.findByPk(id);

      if (!nota) {
          return res.status(404).json({ error: 'Nota não encontrada' });
      }

      if (idColuna !== undefined) {
          nota.idColuna = idColuna;
      }
      if (titulo !== undefined) {
          nota.titulo = titulo;
      }
      if (descricao !== undefined) {
          nota.descricao = descricao;
      }
      if (prioridade !== undefined) {
          nota.prioridade = prioridade;
      }
      if (estado !== undefined) {
          nota.estado = estado;
      }
      if (data !== undefined) {
          nota.data = data;
      }

      //só guarda os dados que recebe, para não deixar dados já definidos a null

      nota = await nota.save();

      return res.status(200).json(nota);
  } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.apagarNota = async (req, res) => {
  try {
    const { id } = req.params;

    const nota = await Nota.findByPk(id);
    if (!nota) {
      return res.status(404).json({ message: 'Nota não encontrada' });
    }

    await nota.destroy();

    res.status(200).json({ message: 'Nota deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    res.status(500).json({ message: 'Erro ao deletar nota' });
  }
};

exports.getTodasNotas = async (req, res) => {
  try {
    const notas = await Nota.findAll();
    res.send(notas);
  } catch (error) {
    console.error('Erro ao listar notas:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.getNotasUtilizador = async (req, res) => {
  try {
      const idUtilizador = req.user.id;
      console.log(idUtilizador)

      const projetosUtilizador = await ProjetoUtilizador.findAll({
          where: { idUtilizador },
          include: { model: Projeto }
      });
      console.log(projetosUtilizador);
      const idsProjetos = projetosUtilizador.map(projetoUtilizador => projetoUtilizador.Projeto.dataValues.id);
      console.log(idsProjetos);

      const notas = await Nota.findAll({
          where: {
              idProjeto: idsProjetos,
              estado: false
          },
          include: [{
              model: Projeto,
              attributes: ['nome'] 
          }]
      });

      res.send(notas);
  }
  catch (error) {
      console.error('Erro ao listar notas do utilizador:', error);
      res.status(500).send({ error: 'Erro interno do servidor' });
  }
}

const e = require('express');
const Coluna = require ('../models/colunaModel');
const Projeto = require ('../models/projetoModel');
const Nota = require ('../models/notaModel');

exports.getColunasProjeto = async (req, res) => {
    try {
        const { id } = req.params;
        const colunas = await Coluna.findAll({
            where: {
                idProjeto: id
            }
        });
        const contador = await Coluna.count({
            where: {
                idProjeto: id
            }
        });
        res.send({ colunas, contador });
    } catch (error) {
        console.error('Erro ao listar colunas:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
};

exports.criarColuna = async (req, res) => {
    const { nome, idProjeto } = req.body;

    try {
        const novaColuna = await Coluna.create({ nome, idProjeto });
        res.json(novaColuna);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.atualizarColuna = async (req, res) => {
    const { nome } = req.body;
    const { id } = req.params;

    try {
        const coluna = await Coluna.findByPk(id);
        await coluna.update({ nome });
        res.json(coluna);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.apagarColuna = async (req, res) => {
    const { id } = req.params;

    try {
        const coluna = await Coluna.findByPk(id);

        // Verificar se existem notas associadas a esta coluna
        const notas = await Nota.findAll({ where: { idColuna: id } });
        if (notas.length > 0) {
            // Apagar as notas associadas
            await Nota.destroy({ where: { idColuna: id } });
        }

        await coluna.destroy();
        res.json({ message: 'Coluna apagada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

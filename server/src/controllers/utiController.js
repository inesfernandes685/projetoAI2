const Utilizador = require('../models/utilizadorModel');
const {ProjetoUtilizador} = require('../models/projetoModel');
const Projeto = require('../models/projetoModel');

exports.getUtilizadores = async (req, res) => {
    try {
        const utilizadores = await Utilizador.findAll();
        res.send(utilizadores);
    } catch (error) {
        console.error('Erro ao listar utilizadores:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
}

exports.getUtilizador = async (req, res) => {
    const { id } = req.params;

    try {
        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).send({ error: 'Utilizador não encontrado' });
        }

        res.send(utilizador);
    } catch (error) {
        console.error('Erro ao obter utilizador:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
}

exports.editarUtilizador = async (req, res) => {
    const { id } = req.params;
    const { nome, email, foto, username, estado, isAdmin} = req.body;

    console.log(req.body)

    try {
        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).send({ error: 'Utilizador não encontrado' });
        }

        await Utilizador.update({ nome, email, foto, username, estado, isAdmin}, { where: { id } });

        res.send({ message: 'Utilizador editado com sucesso' });
    } catch (error) {
        console.error('Erro ao editar utilizador:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
}

exports.apagarUtilizador = async (req, res) => {
    const { id } = req.params;

    try {
        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).send({ error: 'Utilizador não encontrado' });
        }

        await utilizador.destroy();
        res.send({ message: 'Utilizador apagado com sucesso' });
    } catch (error) {
        console.error('Erro ao apagar utilizador:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
}

exports.atualizarFotoUtilizador = async (req, res) => {
    const id  = req.user.id
    console.log(req.user.id)
    const foto = req.file ? req.file.filename : null;

    try {
        const utilizador = await Utilizador.findByPk(id);
        console.log(utilizador)

        if (!utilizador) {
            return res.status(404).send({ error: 'Utilizador não encontrado' });
        }

        await Utilizador.update({ foto }, { where: { id } });
        res.send({ message: 'Foto de perfil atualizada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao atualizar foto de perfil:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
}


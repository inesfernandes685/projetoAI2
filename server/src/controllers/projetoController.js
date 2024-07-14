const { Projeto, ProjetoUtilizador } = require('../models/projetoModel');
const gerarTokenPartilha = require('../middlewares/gerarTokenPartilha');
const descodificarTokenPartilha = require('../middlewares/descodificarTokenPartilha');
const { Utilizador } = require('../models/utilizadorModel');
const Nota = require('../models/notaModel');
const Coluna = require('../models/colunaModel');

exports.criarProjeto = async (req, res) => {
    const { nome, descricao } = req.body;
    const idCriador = req.user.id;

    try {
        const novoProjeto = await Projeto.create({ nome, descricao, idCriador });

        await ProjetoUtilizador.create({ idProjeto: novoProjeto.id, idUtilizador: idCriador });

        res.json(novoProjeto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.atualizarProjeto = async (req, res) => {
    const { nome, descricao } = req.body;
    const { id } = req.params;

    try {
        const projeto = await Projeto.findByPk(id);

        const camposParaAtualizar = {};
        if (nome !== undefined) camposParaAtualizar.nome = nome;
        if (descricao !== undefined) camposParaAtualizar.descricao = descricao;

        await projeto.update(camposParaAtualizar);
        res.json(projeto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.apagarProjeto = async (req, res) => {
    const { id } = req.params;

    try {
        const projeto = await Projeto.findByPk(id);
        
        if (!projeto) {
            return res.status(404).send({ error: 'Projeto não encontrado' });
        }

        // Apagar todas as notas associadas ao projeto
        await Nota.destroy({
            where: { idProjeto: id }
        });

        // Apagar todas as colunas associadas ao projeto
        await Coluna.destroy({
            where: { idProjeto: id }
        });

        // Apagar todas as entradas na tabela ProjetoUtilizador associadas ao projeto
        await ProjetoUtilizador.destroy({
            where: { idProjeto: id }
        });

        // Apagar o projeto
        await projeto.destroy();

        res.send({ message: 'Projeto apagado com sucesso' });
    } catch (error) {
        console.error("Erro ao apagar o projeto: ", error);
        res.status(500).send({ error: 'Erro ao apagar o projeto' });
    }
};

exports.getProjetos = async (req, res) => {
    try {
        const projetos = await Projeto.findAll({
            include: { all: true }
        });

        res.send(projetos);
    } catch (error) {
        console.error('Erro ao listar projetos:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
}

//esta vai identificar o utilizador pelo token e devolver os projetos a que ele pertence
exports.getProjetosToken = async (req, res) => {
    try {
        const projetosUtilizador = await ProjetoUtilizador.findAll({
            where: {
                idUtilizador: req.user.id
            },
            include: {
                model: Projeto
            }
        });

        const projetos = projetosUtilizador.map(projetoUtilizador => projetoUtilizador.Projeto); // Mapeia apenas os projetos do utilizador

        res.json(projetos);
    } catch (error) {
        console.error('Erro ao listar projetos do utilizador:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
};

exports.getProjetosUtilizador = async (req, res) => {
    const { idUtilizador } = req.params;
    //espera ter um id do utilizador pela rota 
    try {
        const projetosUtilizador = await ProjetoUtilizador.findAll({
            where: { idUtilizador },
            include: { model: Projeto }
        });
        //procura na tabela ProjetoUtilizador todos os projetos associados ao utilizador com o id recebido
        const projetos = projetosUtilizador.map(projetoUtilizador => projetoUtilizador.Projeto);

        res.send(projetos);
    } catch (error) {
        console.error('Erro ao listar projetos do utilizador:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
};


exports.getProjeto = async (req, res) => {
    try {
        const { id } = req.params;
        //recebe o id do projeto, por exemplo /projetos/1
        const projeto = await Projeto.findByPk(id, {
            include: { all: true }
        });
        //procura o projeto com o id recebido e mostra tudo sobre ele
        if (!projeto) {
            return res.status(404).send({ error: 'Projeto não encontrado' });
        }

        res.send(projeto);
    } catch (error) {
        console.error('Erro ao obter projeto:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
};


exports.gerarLinkPartilha = async (req, res) => {
    const { idProjeto } = req.params;

    try {
        const token = gerarTokenPartilha(idProjeto);
        const linkPartilha = `${process.env.REACT_APP_FRONTEND}/projetos/partilhar?token=${token}`;
        res.send(linkPartilha);
    } catch (error) {
        console.error('Erro ao gerar token de partilha:', error);
        res.status(500).send('Erro ao gerar token de partilha');
    }
};

exports.getDadosPorToken = async (req, res) => {
    const token = req.query.token;
    //recebe o token
    try {
        const { idProjeto } = descodificarTokenPartilha(token); 
        console.log('Dados:', { idProjeto });
        //através do token, descodifica os dados
        const projeto = await Projeto.findByPk(idProjeto); 
        if (!projeto) {
            return res.status(404).send('Projeto não encontrado');
        }
        //a partir do id descodificado, ele sabe qual vai ser o projeto
        res.send(projeto); 
        //devolve o projeto como resposta
    } catch (error) {
        console.error('Erro ao obter dados por token:', error);
        res.status(500).send('Erro ao obter dados por token');
    }
};

exports.aceitarPartilha = async (req, res) => {
    const idUtilizador = req.user.id; //isto é o id de quem tem a sessão iniciada
    const token = req.body.token; //isto foi recebido pelo link

    console.log('Token:', token);

    try {
        const dados = descodificarTokenPartilha(token); //a partir do token que estava no link, já sabe qual é o projeto
        const idProjeto = dados.idProjeto;
        //aqui já sabe qual é o projeto
        //através do req.user.id, sabe quem é o utilizador que está a aceitar a partilha
        const jaExiste = await ProjetoUtilizador.findOne({
            where: { idProjeto, idUtilizador }
        });
        //verifica se o utilizador já está associado ao projeto
        if (jaExiste) {
            return res.status(400).send('Utilizador já está associado a este projeto.');
        }
        //se o utilizador já estiver associado, não faz nada
        await ProjetoUtilizador.create({ idProjeto, idUtilizador });
        //se o utilizador não estiver associado, associa-o, isto é, adiciona à tabela uma entrada com o id do utilizador e o id do projeto
        res.send('Partilha aceita com sucesso.');
    } catch (error) {
        console.error('Erro ao aceitar partilha:', error);
        res.status(500).send('Erro ao aceitar partilha');
    }
}

exports.eliminarProjeto = async (req, res) => {
    const { id } = req.params;

    try {
        const projeto = await Projeto.findByPk(id);

        if (!projeto) {
            return res.status(404).send({ error: 'Projeto não encontrado' });
        }

        await projeto.destroy();
        res.send('Projeto eliminado com sucesso.');
    } catch (error) {
        console.error('Erro ao eliminar projeto:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
};


exports.utilizadoresProjeto = async (req, res) => {
    const { id } = req.params;

    try {
        const utilizadoresProjeto = await ProjetoUtilizador.findAll({
            where: { idProjeto: id },
            include: {all: true}
        });

        res.send(utilizadoresProjeto);
    } catch (error) {
        console.error('Erro ao listar utilizadores do projeto:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
};


exports.removerColaborador = async (req, res) => {
    const { idProjeto, idUtilizador } = req.params;
    console.log(idProjeto, idUtilizador)

    try {
        await ProjetoUtilizador.destroy({
            where: { idProjeto, idUtilizador }
        });

        res.send('Colaborador removido com sucesso.');
    } catch (error) {
        console.error('Erro ao remover colaborador:', error);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
}
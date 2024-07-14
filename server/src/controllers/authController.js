const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Utilizador = require('../models/utilizadorModel');
require('dotenv').config();
const gerarToken = require('../middlewares/gerarToken');

exports.getUtilizador = (req, res) => {
  //o req.user é para obter o utilizador que está autenticado
  res.send(req.user);
};

exports.getUtilizadorCompleto = async (req, res) => {
  try {
    const utilizador = await Utilizador.findByPk(req.user.id);
    //pelo req.user, ou seja, por quem está com sessão iniciada, são pesquisados e devolvidos os dados todos
    if (!utilizador) {
      return res.status(404).send({ error: 'Utilizador não encontrado' });
    }
    res.send(utilizador);
  } catch (error) {
    console.error('Erro ao obter utilizador:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
}

exports.listar_utilizadores = async (req, res) => {
  try {
    const utilizadores = await Utilizador.findAll();
    res.send(utilizadores);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).send({ error: 'Preencha todos os campos' });
    }

    const user = await Utilizador.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ error: 'Utilizador não encontrado' });
    }

    if (!user.estado) {
      return res.status(401).send({ error: 'Conta não verificada. Verifique o seu email para ativar a sua conta.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Palavra Passe incorreta' });
    }

    const token = gerarToken(user);

    res.send({ message: 'Login realizado com sucesso', token });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.criarConta = async (req, res) => {
  try {
    const {nome, email, password} = req.body;

    if (!nome || !email || !password) {
      return res.status(400).send({ error: 'Preencha todos os campos' });
    }

    const user = await Utilizador.findOne({ where: { email } });
    //verifica se o email já está em uso
    if (user) {
      return res.status(400).send({ error: 'Email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tokenVerificacao = crypto.randomBytes(32).toString('hex');

    const newUser = await Utilizador.create({
      nome, 
      email,
      password: hashedPassword,
      tokenVerificacao
    });

    const token = gerarToken(newUser);

    await enviarEmail({  
      email,
      subject: 'Bem vindo!',
      message: `Bem vindo à sua nova aplicação de notas, esperamos que goste. Clique no link para verificar a sua conta: ${process.env.REACT_APP_FRONTEND}/verificar-email?token=${tokenVerificacao}`
    }); 

    res.status(201).send({ message: 'Conta criada com sucesso', token });
  } catch (error) {
    console.error('Error during account creation:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

const enviarEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: 'TaskPro <taskpro@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado');
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao enviar email');
  }
};

exports.verificarEmail = async (req, res) => {
  try {
    const { token } = req.body || req.query; 
    //recebe o token pelo link de verificar email

    if (!token) {
      return res.status(400).send({ error: 'Token de verificação não fornecido' });
    }

    const user = await Utilizador.findOne({ where: { tokenVerificacao: token } });
    //encontra o utilizador que tem de validar
    if (!user) {
      return res.status(400).send({ error: 'Token de verificação inválido' });
    }

    user.estado = true;
    //muda o estado do utilizador para true, ou seja, a conta está verificada
    user.tokenVerificacao = null;
    //já foi validado, não é necessário o token
    await user.save();

    res.status(200).send({ message: 'Email verificado com sucesso. Pode seguir para o login' });
  } catch (error) {
    console.error('Erro durante a verificação de email:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.recuperarPasse = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Utilizador.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({ error: 'Utilizador não encontrado' });
    }

    const tokenVerificacao = crypto.randomBytes(32).toString('hex');
    user.tokenVerificacao = tokenVerificacao; 
    await user.save();

    const resetUrl = `${process.env.REACT_APP_FRONTEND}/nova-passe?token=${tokenVerificacao}`;
    await enviarEmail({
      email,
      subject: 'Recuperação de Palavra Passe',
      message: `Clique no link a seguir para redefinir a sua palavra-passe: ${resetUrl}`
    });

    res.send({ message: 'Email enviado com sucesso. Verifique o seu email para recuperar a password ' });
  } catch (error) {
    console.error('Error during password recovery:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

exports.novaPasse = async (req, res) => {
  try {
    const { token, novaPass } = req.body;
    console.log(req.body);

    const user = await Utilizador.findOne({ where: { tokenVerificacao: token } });
    if (!user) {
      return res.status(400).send({ error: 'Token inválido' });
    }

    user.isPrimeiroLogin = false;
    await user.save();

    console.log(novaPass);
    const hashedPassword = await bcrypt.hash(novaPass, 10);
    console.log(hashedPassword);
    user.palavra_passe = hashedPassword;
    user.recoveryToken = null;
    await user.save();

    res.send({ message: 'A sua password foi redefinida com sucesso' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};
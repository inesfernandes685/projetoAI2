const jwt = require('jsonwebtoken');

function gerarToken(user) {
  const payload = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    estado: user.estado
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  return token;
}

module.exports = gerarToken;
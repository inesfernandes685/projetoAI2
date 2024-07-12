const jwt = require('jsonwebtoken');

function gerarTokenPartilha(idProjeto) {
  const payload = { idProjeto };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  return token;
}

module.exports = gerarTokenPartilha;

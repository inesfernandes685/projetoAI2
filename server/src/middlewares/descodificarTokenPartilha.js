const jwt = require('jsonwebtoken');

function descodificarTokenPartilha(token) {
    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        return dados;
    } catch (error) {
        throw new Error('Token inválido ou expirado');
    }
}

module.exports = descodificarTokenPartilha;

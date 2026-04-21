const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifierToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token manquant' });
  const tokenPur = token.split(' ')[1];
  jwt.verify(tokenPur, process.env.JWT_SECRET, function(err, decoded) {
    if (err) return res.status(401).json({ message: 'Token invalide' });
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifierToken;
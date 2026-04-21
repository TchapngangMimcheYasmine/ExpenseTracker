const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.inscription = function(req, res) {
  const { nom, email, mot_de_passe } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], function(err, results) {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length > 0) return res.status(400).json({ message: 'Email déjà utilisé' });
    const hash = bcrypt.hashSync(mot_de_passe, 10);
    db.query('INSERT INTO users (nom, email, mot_de_passe) VALUES (?, ?, ?)', [nom, email, hash], function(err) {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.status(201).json({ message: 'Compte créé avec succès !' });
    });
  });
};

exports.connexion = function(req, res) {
  const { email, mot_de_passe } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], function(err, results) {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length === 0) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    const user = results[0];
    const valide = bcrypt.compareSync(mot_de_passe, user.mot_de_passe);
    if (!valide) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email } });
  });
};
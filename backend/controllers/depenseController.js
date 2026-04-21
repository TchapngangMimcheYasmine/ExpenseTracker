const db = require('../config/db');

exports.ajouterDepense = function(req, res) {
  const { montant, categorie, description, date } = req.body;
  const userId = req.userId;
  db.query(
    'INSERT INTO depenses (user_id, montant, categorie, description, date) VALUES (?, ?, ?, ?, ?)',
    [userId, montant, categorie, description, date],
    function(err) {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.status(201).json({ message: 'Dépense ajoutée avec succès !' });
    }
  );
};

exports.getDepenses = function(req, res) {
  const userId = req.userId;
  db.query('SELECT * FROM depenses WHERE user_id = ? ORDER BY date DESC', [userId], function(err, results) {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.json(results);
  });
};

exports.modifierDepense = function(req, res) {
  const { montant, categorie, description, date } = req.body;
  const { id } = req.params;
  const userId = req.userId;
  db.query(
    'UPDATE depenses SET montant = ?, categorie = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
    [montant, categorie, description, date, id, userId],
    function(err) {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json({ message: 'Dépense modifiée avec succès !' });
    }
  );
};

exports.supprimerDepense = function(req, res) {
  const { id } = req.params;
  const userId = req.userId;
  db.query('DELETE FROM depenses WHERE id = ? AND user_id = ?', [id, userId], function(err) {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.json({ message: 'Dépense supprimée avec succès !' });
  });
};

exports.getStatistiques = function(req, res) {
  const userId = req.userId;
  db.query(
    'SELECT categorie, SUM(montant) as total FROM depenses WHERE user_id = ? GROUP BY categorie',
    [userId],
    function(err, results) {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json(results);
    }
  );
};
const express = require('express');
const router = express.Router();
const verifierToken = require('../middleware/auth');
const { ajouterDepense, getDepenses, modifierDepense, supprimerDepense, getStatistiques } = require('../controllers/depenseController');

router.use(verifierToken);
router.post('/', ajouterDepense);
router.get('/', getDepenses);
router.put('/:id', modifierDepense);
router.delete('/:id', supprimerDepense);
router.get('/statistiques', getStatistiques);

module.exports = router;
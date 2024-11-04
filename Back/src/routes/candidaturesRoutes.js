const express = require('express');
const router = express.Router();
const candidaturesControllers = require('../controllers/candidaturesControllers');

router.get('/', candidaturesControllers.getAllCandidatures);
router.get('/:id', candidaturesControllers.getCandidatureById);
router.post('/', candidaturesControllers.getCreateCandidature);
router.patch('/:id', candidaturesControllers.getUpdateCandidature);
router.delete('/:id', candidaturesControllers.getDeleteCandidature);

module.exports = router;
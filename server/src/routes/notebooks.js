const express = require('express');
const router = express.Router();
const notebooksController = require('../controllers/notebooksController');
const { protect } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.use(protect);

router.get('/', notebooksController.getNotebooks);
router.post('/', validate(schemas.createNotebook), notebooksController.createNotebook);
router.patch('/:id', notebooksController.updateNotebook);
router.delete('/:id', notebooksController.deleteNotebook);

module.exports = router;
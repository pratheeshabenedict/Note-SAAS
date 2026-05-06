const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { protect } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.use(protect);

router.get('/stats', notesController.getStats);
router.get('/', notesController.getNotes);
router.post('/', validate(schemas.createNote), notesController.createNote);
router.patch('/bulk', notesController.bulkUpdate);
router.delete('/trash', notesController.emptyTrash);
router.get('/:id', notesController.getNote);
router.patch('/:id', validate(schemas.updateNote), notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
router.patch('/:id/restore', notesController.restoreNote);

module.exports = router;
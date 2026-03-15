import { Router } from 'express';
import {
  createNote,
  getNoteById,
  updateNote,
  replaceNote,
  updateAllNotesTitle,
  deleteNote,
  deleteAllNotes,
  getPaginatedNotes,
  getNoteByContent,
  getNotesWithUser,
  getNotesAggregate
} from './note.controller.js';
import authenticateToken from '../../middleware/authenticateToken.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createNote);
router.get('/:id', getNoteById);
router.patch('/:noteId', updateNote);
router.put('/replace/:noteId', replaceNote);
router.patch('/all', updateAllNotesTitle);
router.delete('/:noteId', deleteNote);
router.delete('/', deleteAllNotes);
router.get('/paginate-sort', getPaginatedNotes);
router.get('/note-by-content', getNoteByContent);
router.get('/note-with-user', getNotesWithUser);
router.get('/aggregate', getNotesAggregate);

export default router;

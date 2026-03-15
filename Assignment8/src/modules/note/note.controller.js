import {
  createNote as createNoteSvc,
  getNoteById as getNoteByIdSvc,
  updateNote as updateNoteSvc,
  replaceNote as replaceNoteSvc,
  updateAllNotesTitle as updateAllNotesTitleSvc,
  deleteNote as deleteNoteSvc,
  deleteAllNotes as deleteAllNotesSvc,
  getPaginatedNotes as getPaginatedNotesSvc,
  getNoteByContent as getNoteByContentSvc,
  getNotesWithUser as getNotesWithUserSvc,
  getNotesAggregate as getNotesAggregateSvc
} from './note.service.js';

export const createNote = async (req, res) => {
  try {
    const note = await createNoteSvc(req.userId, req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getNoteById = async (req, res) => {
  const note = await getNoteByIdSvc(req.params.id, req.userId);
  if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });
  res.json(note);
};

export const updateNote = async (req, res) => {
  const note = await updateNoteSvc(req.params.noteId, req.userId, req.body);
  if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });
  res.json(note);
};

export const replaceNote = async (req, res) => {
  const note = await replaceNoteSvc(req.params.noteId, req.userId, req.body);
  if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });
  res.json(note);
};

export const updateAllNotesTitle = async (req, res) => {
  const result = await updateAllNotesTitleSvc(req.userId, req.body.newTitle);
  res.json({ updated: result?.modifiedCount ?? result?.nModified ?? 0 });
};

export const deleteNote = async (req, res) => {
  const note = await deleteNoteSvc(req.params.noteId, req.userId);
  if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });
  res.json(note);
};

export const deleteAllNotes = async (req, res) => {
  const result = await deleteAllNotesSvc(req.userId);
  res.json({ deleted: result.deletedCount });
};

export const getPaginatedNotes = async (req, res) => {
  const notes = await getPaginatedNotesSvc(
    req.userId,
    parseInt(req.query.page) || 1,
    parseInt(req.query.limit) || 10
  );
  res.json(notes);
};

export const getNoteByContent = async (req, res) => {
  const note = await getNoteByContentSvc(req.userId, req.query.content);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
};

export const getNotesWithUser = async (req, res) => {
  const notes = await getNotesWithUserSvc(req.userId);
  res.json(notes);
};

export const getNotesAggregate = async (req, res) => {
  const notes = await getNotesAggregateSvc(req.userId, req.query.title);
  res.json(notes);
};

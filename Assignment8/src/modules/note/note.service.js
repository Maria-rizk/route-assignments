import { Note } from '../../DB/model/index.js';

export const createNote = async (userId, data) => {
  const note = new Note({ ...data, userId });
  return await note.save();
};

export const getNoteById = async (noteId, userId) => {
  return await Note.findOne({ _id: noteId, userId });
};

export const updateNote = async (noteId, userId, updates) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, userId },
    updates,
    { new: true, runValidators: true }
  );
};

export const replaceNote = async (noteId, userId, data) => {
  return await Note.findOneAndReplace(
    { _id: noteId, userId },
    { ...data, userId },
    { new: true, runValidators: true }
  );
};

export const updateAllNotesTitle = async (userId, newTitle) => {
  return await Note.updateMany({ userId }, { title: newTitle });
};

export const deleteNote = async (noteId, userId) => {
  return await Note.findOneAndDelete({ _id: noteId, userId });
};

export const deleteAllNotes = async (userId) => {
  return await Note.deleteMany({ userId });
};

export const getPaginatedNotes = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Note.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const getNoteByContent = async (userId, content) => {
  return await Note.findOne({ userId, content: { $regex: content, $options: 'i' } });
};

export const getNotesWithUser = async (userId) => {
  return await Note.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $project: {
        title: 1,
        userId: 1,
        createdAt: 1,
        'user.email': 1
      }
    }
  ]);
};

export const getNotesAggregate = async (userId, titleQuery) => {
  const match = { userId };
  if (titleQuery) match.title = { $regex: titleQuery, $options: 'i' };

  return await Note.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        'user.name': 1,
        'user.email': 1
      }
    }
  ]);
};

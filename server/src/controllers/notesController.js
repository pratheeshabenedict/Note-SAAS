const Note = require('../models/Note');
const { AppError, NotFoundError } = require('../utils/errors');

// Helper: ownership check
const findUserNote = async (id, userId) => {
  const note = await Note.findOne({ _id: id, user: userId });
  if (!note) throw new NotFoundError('Note');
  return note;
};

exports.getNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-updatedAt',
      notebook,
      tags,
      color,
      isPinned,
      isFavorite,
      isArchived = false,
      isTrashed = false,
      search,
      view,
    } = req.query;

    const filter = {
      user: req.user._id,
      isTrashed: isTrashed === 'true',
      isArchived: isArchived === 'true',
    };

    if (notebook) filter.notebook = notebook;
    if (tags) filter.tags = { $all: tags.split(',').map((t) => t.trim()) };
    if (color) filter.color = color;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';

    let query;
    if (search) {
      query = Note.find({ ...filter, $text: { $search: search } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      query = Note.find(filter).sort(sort);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [notes, total] = await Promise.all([
      query.skip(skip).limit(Number(limit)).populate('notebook', 'name color icon'),
      Note.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: notes,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id })
      .populate('notebook', 'name color icon');
    if (!note) return next(new NotFoundError('Note'));
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await findUserNote(req.params.id, req.user._id);
    Object.assign(note, req.body);
    await note.save();
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await findUserNote(req.params.id, req.user._id);

    if (!note.isTrashed) {
      // Move to trash first
      note.isTrashed = true;
      note.trashedAt = new Date();
      await note.save();
      return res.json({ success: true, message: 'Note moved to trash.' });
    }

    // Permanent delete
    await note.deleteOne();
    res.json({ success: true, message: 'Note permanently deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.restoreNote = async (req, res, next) => {
  try {
    const note = await findUserNote(req.params.id, req.user._id);
    note.isTrashed = false;
    note.trashedAt = null;
    await note.save();
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.emptyTrash = async (req, res, next) => {
  try {
    const result = await Note.deleteMany({ user: req.user._id, isTrashed: true });
    res.json({ success: true, message: `${result.deletedCount} notes permanently deleted.` });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpdate = async (req, res, next) => {
  try {
    const { ids, updates } = req.body;
    if (!ids?.length) return next(new AppError('Note IDs required.', 400));

    const allowed = ['isPinned', 'isFavorite', 'isArchived', 'isTrashed', 'color', 'notebook', 'tags'];
    const safeUpdates = {};
    allowed.forEach((k) => { if (updates[k] !== undefined) safeUpdates[k] = updates[k]; });
    if (updates.isTrashed) safeUpdates.trashedAt = new Date();

    const result = await Note.updateMany(
      { _id: { $in: ids }, user: req.user._id },
      { $set: safeUpdates }
    );

    res.json({ success: true, message: `${result.modifiedCount} notes updated.` });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [stats] = await Note.aggregate([
      { $match: { user: req.user._id, isTrashed: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          archived: { $sum: { $cond: ['$isArchived', 1, 0] } },
          pinned: { $sum: { $cond: ['$isPinned', 1, 0] } },
          favorites: { $sum: { $cond: ['$isFavorite', 1, 0] } },
          totalWords: { $sum: '$wordCount' },
          totalChars: { $sum: '$charCount' },
        },
      },
    ]);

    const trashed = await Note.countDocuments({ user: req.user._id, isTrashed: true });

    res.json({
      success: true,
      data: { ...stats, trashed, _id: undefined },
    });
  } catch (error) {
    next(error);
  }
};
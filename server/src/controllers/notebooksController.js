const Notebook = require('../models/Notebook');
const Note = require('../models/Note');
const { NotFoundError, AppError } = require('../utils/errors');

exports.getNotebooks = async (req, res, next) => {
  try {
    const notebooks = await Notebook.find({ user: req.user._id })
      .sort('sortOrder name')
      .populate('noteCount');
    res.json({ success: true, data: notebooks });
  } catch (error) {
    next(error);
  }
};

exports.createNotebook = async (req, res, next) => {
  try {
    const count = await Notebook.countDocuments({ user: req.user._id });
    if (req.user.plan === 'free' && count >= 5) {
      return next(new AppError('Free plan allows up to 5 notebooks. Upgrade to Pro for unlimited.', 403));
    }
    const notebook = await Notebook.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: notebook });
  } catch (error) {
    next(error);
  }
};

exports.updateNotebook = async (req, res, next) => {
  try {
    const notebook = await Notebook.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!notebook) return next(new NotFoundError('Notebook'));
    res.json({ success: true, data: notebook });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotebook = async (req, res, next) => {
  try {
    const notebook = await Notebook.findOne({ _id: req.params.id, user: req.user._id });
    if (!notebook) return next(new NotFoundError('Notebook'));
    if (notebook.isDefault) return next(new AppError('Cannot delete the default notebook.', 400));

    // Move notes to no notebook
    await Note.updateMany({ notebook: notebook._id, user: req.user._id }, { notebook: null });
    await notebook.deleteOne();

    res.json({ success: true, message: 'Notebook deleted. Notes have been unassigned.' });
  } catch (error) {
    next(error);
  }
};
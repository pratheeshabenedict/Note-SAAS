const mongoose = require('mongoose');

const notebookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Notebook name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    color: {
      type: String,
      enum: ['default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'],
      default: 'default',
    },
    icon: {
      type: String,
      default: '📓',
    },
    isDefault: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: note count in this notebook
notebookSchema.virtual('noteCount', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'notebook',
  count: true,
  match: { isTrashed: false, isArchived: false },
});

notebookSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Notebook', notebookSchema);
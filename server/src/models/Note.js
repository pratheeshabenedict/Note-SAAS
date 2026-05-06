const mongoose = require('mongoose');
const slugify = require('slugify');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'Untitled Note',
    },
    content: {
      type: String,
      default: '',
    },
    contentText: {
      type: String,
      default: '',
      select: false, // for search indexing only
    },
    slug: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notebook',
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 30,
      },
    ],
    color: {
      type: String,
      enum: ['default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'],
      default: 'default',
    },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    trashedAt: { type: Date, default: null },
    isFavorite: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    publicSlug: { type: String, unique: true, sparse: true },
    wordCount: { type: Number, default: 0 },
    charCount: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 }, // in seconds
    coverImage: { type: String, default: null },
    lastEditedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ user: 1, isTrashed: 1 });
noteSchema.index({ user: 1, isArchived: 1 });
noteSchema.index({ user: 1, tags: 1 });
noteSchema.index({ user: 1, notebook: 1 });
noteSchema.index({ title: 'text', contentText: 'text', tags: 'text' });

// Pre-save hooks
noteSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    const base = slugify(this.title, { lower: true, strict: true });
    this.slug = `${base}-${this._id.toString().slice(-6)}`;
  }

  if (this.isModified('content')) {
    const plainText = this.content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    this.contentText = plainText;

    const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
    this.wordCount = words;
    this.charCount = plainText.length;
    this.readingTime = Math.ceil((words / 200) * 60); // avg 200 wpm
    this.lastEditedAt = new Date();
  }

  if (this.isModified('isPublic') && this.isPublic && !this.publicSlug) {
    const { v4: uuidv4 } = require('uuid');
    this.publicSlug = uuidv4().replace(/-/g, '').slice(0, 16);
  }

  next();
});

// Auto-delete trashed notes after 30 days (handle via scheduled job)
noteSchema.statics.purgeOldTrashed = async function () {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({ isTrashed: true, trashedAt: { $lt: thirtyDaysAgo } });
};

module.exports = mongoose.model('Note', noteSchema);
const Joi = require('joi');
const { AppError } = require('../utils/errors');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const message = error.details.map((d) => d.message.replace(/"/g, '')).join('. ');
    return next(new AppError(message, 422));
  }
  next();
};

// Auth schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(72).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Note schemas
const createNoteSchema = Joi.object({
  title: Joi.string().max(200).default('Untitled Note'),
  content: Joi.string().allow('').default(''),
  notebook: Joi.string().hex().length(24).allow(null).default(null),
  tags: Joi.array().items(Joi.string().max(30)).max(20).default([]),
  color: Joi.string().valid('default','red','orange','yellow','green','teal','blue','purple','pink').default('default'),
  isPinned: Joi.boolean().default(false),
  isFavorite: Joi.boolean().default(false),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().max(200),
  content: Joi.string().allow(''),
  notebook: Joi.string().hex().length(24).allow(null),
  tags: Joi.array().items(Joi.string().max(30)).max(20),
  color: Joi.string().valid('default','red','orange','yellow','green','teal','blue','purple','pink'),
  isPinned: Joi.boolean(),
  isArchived: Joi.boolean(),
  isFavorite: Joi.boolean(),
  isPublic: Joi.boolean(),
});

// Notebook schemas
const createNotebookSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(300).allow('').default(''),
  color: Joi.string().valid('default','red','orange','yellow','green','teal','blue','purple','pink').default('default'),
  icon: Joi.string().max(4).default('📓'),
});

module.exports = {
  validate,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    createNote: createNoteSchema,
    updateNote: updateNoteSchema,
    createNotebook: createNotebookSchema,
  },
};
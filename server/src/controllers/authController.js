const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notebook = require('../models/Notebook');
const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

// Helper: send tokens as response
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Store refresh token
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  user.refreshTokens.push({ token: refreshToken, expiresAt });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res
    .cookie('refreshToken', refreshToken, cookieOptions)
    .status(statusCode)
    .json({
      success: true,
      accessToken,
      user: user.toJSON(),
    });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError('An account with this email already exists.', 409));
    }

    const user = await User.create({ name, email, password });

    // Create default notebook for new user
    await Notebook.create({
      name: 'My Notes',
      user: user._id,
      icon: '📓',
      isDefault: true,
      color: 'default',
    });

    logger.info(`New user registered: ${email}`);
    await user.save();
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password.', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated.', 401));
    }

    // Clean expired refresh tokens
    user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > new Date());

    logger.info(`User logged in: ${email}`);
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return next(new AppError('Refresh token required.', 401));

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError('User not found.', 401));

    const tokenRecord = user.refreshTokens.find((t) => t.token === token);
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return next(new AppError('Invalid or expired refresh token.', 401));
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid refresh token. Please log in again.', 401));
    }
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (token && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter((t) => t.token !== token);
      await req.user.save();
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'preferences'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect.', 400));
    }

    user.password = newPassword;
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    res.json({ success: true, message: 'Password changed. Please log in again.' });
  } catch (error) {
    next(error);
  }
};
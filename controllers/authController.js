const User = require('../models/User');
const generateTokens = require('../utils/generateTokens');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Helper to format consistent response
const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data && { data })
  });
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, 'Validation Error', errors.array());
  }

  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendResponse(res, 400, 'User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Explicitly exclude password in returned data
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };

    sendResponse(res, 201, 'User registered successfully', { accessToken, user: userData });
  } catch (error) {
    sendResponse(res, 500, 'Server Error', error.message);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, 'Validation Error', errors.array());
  }

  try {
    const { email, password } = req.body;

    // We explicitly select +password since we set select: false in model by default
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendResponse(res, 401, 'Invalid credentials');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, 'User account is inactive. Not authorized.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };

    sendResponse(res, 200, 'Login successful', { accessToken, user: userData });
  } catch (error) {
    sendResponse(res, 500, 'Server Error', error.message);
  }
};

const refreshToken = async (req, res) => {
  const currentRefreshToken = req.cookies.refreshToken;

  if (!currentRefreshToken) {
    return sendResponse(res, 401, 'No refresh token provided');
  }

  try {
    const decoded = jwt.verify(currentRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendResponse(res, 401, 'Invalid refresh token');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, 'User account is inactive. Not authorized.');
    }

    const tokens = generateTokens(user._id);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, 200, 'Token refreshed successfully', { accessToken: tokens.accessToken });
  } catch (error) {
    sendResponse(res, 401, 'Invalid or expired refresh token');
  }
};

const logout = async (req, res) => {
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendResponse(res, 200, 'User logged out successfully');
};

const getMe = async (req, res) => {
  // req.user is populated by verifyToken middleware which explicitly excludes password
  const user = req.user;
  if (!user) {
    return sendResponse(res, 401, 'User not found');
  }
  
  sendResponse(res, 200, 'User profile retrieved', { user });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};

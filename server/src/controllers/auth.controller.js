import crypto from 'crypto';
import User from '../models/user.model.js';
import {
  clearAuthCookies,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
} from '../utils/token.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const hashRefreshToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    const accessToken = signAccessToken({ sub: user._id.toString() });
    const refreshToken = signRefreshToken({ sub: user._id.toString() });
    user.refreshToken = hashRefreshToken(refreshToken);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to signup user',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({ sub: user._id.toString() });
    const refreshToken = signRefreshToken({ sub: user._id.toString() });
    user.refreshToken = hashRefreshToken(refreshToken);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to login user',
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const hashedToken = hashRefreshToken(refreshToken);
      await User.findOneAndUpdate({ refreshToken: hashedToken }, { $set: { refreshToken: null } });
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to logout user',
      error: error.message,
    });
  }
};

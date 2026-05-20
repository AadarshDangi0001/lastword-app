import validator from 'validator';
import mongoose from 'mongoose';

const badRequest = (res, message) =>
  res.status(400).json({
    success: false,
    message,
  });

export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return badRequest(res, 'Name, email, and password are required');
  }

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
    return badRequest(res, 'Name must be between 2 and 60 characters');
  }

  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return badRequest(res, 'Invalid email format');
  }

  if (
    typeof password !== 'string' ||
    !validator.isStrongPassword(password, { minLength: 8, minSymbols: 0 })
  ) {
    return badRequest(
      res,
      'Password must be at least 8 characters and include uppercase, lowercase, and a number'
    );
  }

  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return badRequest(res, 'Email and password are required');
  }

  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return badRequest(res, 'Invalid email format');
  }

  if (typeof password !== 'string' || password.length < 8) {
    return badRequest(res, 'Password must be at least 8 characters long');
  }

  req.body.email = email.toLowerCase().trim();

  next();
};

export const validateLogout = (req, res, next) => {
  const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;

  if (refreshToken && typeof refreshToken !== 'string') {
    return badRequest(res, 'Invalid refresh token');
  }

  next();
};

export const validateContactCreate = (req, res, next) => {
  const { name, email, number, message } = req.body;

  if (!name || !email || !number || !message) {
    return badRequest(res, 'Name, email, number, and message are required');
  }

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
    return badRequest(res, 'Name must be between 2 and 60 characters');
  }

  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return badRequest(res, 'Invalid email format');
  }

  const cleanedNumber = String(number).trim();
  if (!validator.isMobilePhone(cleanedNumber, 'any', { strictMode: false })) {
    return badRequest(res, 'Please provide a valid phone number');
  }

  if (typeof message !== 'string' || message.trim().length < 1 || message.trim().length > 300) {
    return badRequest(res, 'Message must be between 1 and 300 characters');
  }

  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();
  req.body.number = cleanedNumber;
  req.body.message = message.trim();

  next();
};

export const validateContactIdParam = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    return badRequest(res, 'Invalid contact id');
  }

  next();
};
import { User } from '../../DB/model/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const encryptPhone = (phone) => {
  const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY || 'default_key').digest('base64').substring(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(phone, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return JSON.stringify({ encrypted, iv: iv.toString('hex') });
};

export const signup = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error('Email already exists');
  const encryptedPhone = encryptPhone(userData.phone);
  const user = new User({
    ...userData,
    phone: encryptedPhone
  });
  return await user.save();
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  return { token, userId: user._id };
};
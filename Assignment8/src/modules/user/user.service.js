import { User } from '../../DB/model/index.js';

export const getUserById = async (userId) => {
  return await User.findById(userId).select('-password');
};

export const updateUser = async (userId, updates) => {
  if (updates.email) {
    const existing = await User.findOne({ email: updates.email, _id: { $ne: userId } });
    if (existing) throw new Error('Email already in use');
  }
  return await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
};

export const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

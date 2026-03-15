import { getUserById, updateUser as updateUserService, deleteUser as deleteUserService } from './user.service.js';

export const getUser = async (req, res) => {
  const user = await getUserById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.userId, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await deleteUserService(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

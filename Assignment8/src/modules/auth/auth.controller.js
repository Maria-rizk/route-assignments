import { signup as signupService, login as loginService } from './auth.service.js';

export const signup = async (req, res) => {
  try {
    const user = await signupService(req.body);
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token } = await loginService(req.body.email, req.body.password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
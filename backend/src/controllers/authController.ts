import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const token = await registerUser(email, password);
    return res.status(201).json({ token });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const token = await loginUser(email, password);
    return res.json({ token });
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message });
  }
};

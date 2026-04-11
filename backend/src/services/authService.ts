import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { JWT_SECRET } from '../utils/config';

export const registerUser = async (email: string, password: string) => {
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    return createToken(user);
  } catch (error) {
    if ((error as any).name === 'MongooseError' || (error as any).code) {
      throw new Error('Database connection failed. Please check your MongoDB configuration.');
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new Error('Invalid email or password');
    }
    return createToken(user);
  } catch (error) {
    if ((error as any).name === 'MongooseError' || (error as any).code) {
      throw new Error('Database connection failed. Please check your MongoDB configuration.');
    }
    throw error;
  }
};

const createToken = (user: IUser) => {
  return jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
};

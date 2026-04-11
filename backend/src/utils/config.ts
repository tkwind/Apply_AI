import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'NIM_API_KEY', 'NIM_API_URL'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const MONGODB_URI = process.env.MONGODB_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const NIM_API_KEY = process.env.NIM_API_KEY as string;
export const NIM_API_URL = process.env.NIM_API_URL as string;
export const NIM_MODEL = process.env.NIM_MODEL || 'meta/llama-3.1-405b-instruct';
export const SERVER_PORT = Number(process.env.PORT || 4000);
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

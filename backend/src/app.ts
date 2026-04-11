import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import { errorHandler } from './middleware/errorHandler';
import { FRONTEND_URL } from './utils/config';

const app = express();
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;

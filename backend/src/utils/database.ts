import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

const connectDatabase = async () => {
  await mongoose.connect(MONGODB_URI, {
    dbName: 'job-tracker',
    autoCreate: true,
  });
  console.log('Connected to MongoDB');
};

export default connectDatabase;

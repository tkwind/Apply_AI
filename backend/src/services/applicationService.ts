import Application, { IApplication } from '../models/Application';

export const listApplications = async (userId: string) => {
  try {
    return await Application.find({ userId }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    if ((error as any).name === 'MongooseError' || (error as any).code) {
      throw new Error('Database connection failed. Please check your MongoDB configuration.');
    }
    throw error;
  }
};

export const createApplication = async (data: Partial<IApplication> & { userId: string }) => {
  try {
    return await Application.create(data);
  } catch (error) {
    if ((error as any).name === 'MongooseError' || (error as any).code) {
      throw new Error('Database connection failed. Please check your MongoDB configuration.');
    }
    throw error;
  }
};

export const updateApplication = async (id: string, userId: string, payload: Partial<IApplication>) => {
  try {
    const app = await Application.findOneAndUpdate({ _id: id, userId }, payload, { new: true }).lean();
    if (!app) {
      throw new Error('Application not found');
    }
    return app;
  } catch (error) {
    if ((error as any).name === 'MongooseError' || (error as any).code) {
      throw new Error('Database connection failed. Please check your MongoDB configuration.');
    }
    throw error;
  }
};

export const deleteApplication = async (id: string, userId: string) => {
  try {
    const result = await Application.deleteOne({ _id: id, userId });
    if (result.deletedCount !== 1) {
      throw new Error('Application not found');
    }
  } catch (error) {
    if ((error as any).name === 'MongooseError' || (error as any).code) {
      throw new Error('Database connection failed. Please check your MongoDB configuration.');
    }
    throw error;
  }
};

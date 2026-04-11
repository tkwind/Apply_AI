import { Schema, model, Document, Types } from 'mongoose';

export interface IApplication extends Document {
  userId: Types.ObjectId;
  company: string;
  role: string;
  jobDescription: string;
  jdLink?: string;
  notes?: string;
  dateApplied: string;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  salaryRange?: string;
  skills: string[];
  niceToHave: string[];
  seniority: string;
  location: string;
  createdAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jdLink: { type: String, trim: true },
  notes: { type: String, trim: true },
  dateApplied: { type: String, required: true },
  status: { type: String, enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'], default: 'Applied' },
  salaryRange: { type: String, trim: true },
  skills: { type: [String], default: [] },
  niceToHave: { type: [String], default: [] },
  seniority: { type: String, default: '' },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default model<IApplication>('Application', applicationSchema);

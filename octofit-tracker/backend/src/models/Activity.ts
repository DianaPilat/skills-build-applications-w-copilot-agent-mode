import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: string;
  duration: number;
  distance?: number;
  caloriesBurned: number;
  description?: string;
  dateCompleted: Date;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      required: true,
      enum: ['running', 'cycling', 'swimming', 'gym', 'yoga', 'other'],
    },
    duration: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
    },
    caloriesBurned: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    dateCompleted: {
      type: Date,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IActivity>('Activity', activitySchema);

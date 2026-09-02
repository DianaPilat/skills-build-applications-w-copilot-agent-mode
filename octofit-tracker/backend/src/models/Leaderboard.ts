import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboardEntry {
  type: 'user' | 'team';
  refId: mongoose.Types.ObjectId;
  name: string;
  points: number;
}

export interface ILeaderboard extends Document {
  generatedAt: Date;
  entries: ILeaderboardEntry[];
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  type: { type: String, required: true },
  refId: { type: Schema.Types.ObjectId, required: true, refPath: 'entries.type' },
  name: { type: String, required: true },
  points: { type: Number, required: true },
});

const leaderboardSchema = new Schema<ILeaderboard>({
  generatedAt: { type: Date, default: Date.now },
  entries: [leaderboardEntrySchema],
});

export default mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);

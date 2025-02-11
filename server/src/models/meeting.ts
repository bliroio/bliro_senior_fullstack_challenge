import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  room: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  title: string;
  startTime: Date;
  endTime: Date;
}

const meetingSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
);

// Compound indexes for efficient querying
meetingSchema.index({ room: 1, startTime: 1, endTime: 1 });
meetingSchema.index({ tenant: 1, startTime: 1, endTime: 1 });

const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema);
export default Meeting;

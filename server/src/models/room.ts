import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  tenant: mongoose.Types.ObjectId;
  name: string;
  capacity: number;
  features: Map<string, any>;
}

const roomSchema = new Schema(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    features: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index for efficient tenant-based queries
roomSchema.index({ tenant: 1 });

const Room = mongoose.model<IRoom>('Room', roomSchema);
export default Room;

import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  description?: string;
}

const tenantSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
export default Tenant;

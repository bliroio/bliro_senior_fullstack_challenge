import mongoose, { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IMeeting extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
}

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

meetingSchema.plugin(mongoosePaginate);

interface MeetingModel<T extends Document> extends mongoose.PaginateModel<T> {}

const Meeting = mongoose.model<IMeeting, MeetingModel<IMeeting>>('Meeting', meetingSchema);
export default Meeting;

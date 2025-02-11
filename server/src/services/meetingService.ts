import Meeting, { IMeeting } from '../models/meeting';
import { PaginateResult } from 'mongoose';

interface ListMeetingsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

const createMeeting = async (meetingData: IMeeting): Promise<IMeeting> => {
  const meeting = new Meeting(meetingData);
  return meeting.save();
};

const getMeetingById = async (id: string): Promise<IMeeting | null> => {
  return Meeting.findById(id);
};

const updateMeeting = async (
  id: string,
  updateData: Partial<IMeeting>
): Promise<IMeeting | null> => {
  return Meeting.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteMeeting = async (id: string): Promise<IMeeting | null> => {
  return Meeting.findByIdAndDelete(id);
};

const listMeetings = async (
  options: ListMeetingsOptions = {}
): Promise<PaginateResult<IMeeting>> => {
  const { page = 1, limit = 10, search = '' } = options;

  const query = search ? { title: { $regex: search, $options: 'i' } } : {};

  return Meeting.paginate(query, { page, limit });
};

export default {
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  listMeetings,
};

import meetingService from '../services/meetingService';

const createMeeting = async (req: any, res: any) => {
  try {
    const newMeeting = await meetingService.createMeeting(req.body);
    res.status(201).json(newMeeting);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getMeeting = async (req: any, res: any) => {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateMeeting = async (req: any, res: any) => {
  try {
    const updatedMeeting = await meetingService.updateMeeting(
      req.params.id,
      req.body
    );
    if (!updatedMeeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(updatedMeeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMeeting = async (req: any, res: any) => {
  try {
    const deletedMeeting = await meetingService.deleteMeeting(req.params.id);
    if (!deletedMeeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const listMeetings = async (req: any, res: any) => {
  try {
    const { page, limit, search } = req.query;
    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      search: search as string,
    };

    const meetings = await meetingService.listMeetings(options);
    res.json(meetings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createMeeting,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  listMeetings,
};

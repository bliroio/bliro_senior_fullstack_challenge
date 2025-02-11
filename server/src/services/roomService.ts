import mongoose, { Types } from 'mongoose';
import Room from '../models/room';
import Meeting from '../models/meeting';
import { IRoom } from '../models/room';
import { IMeeting } from '../models/meeting';

export class RoomService {
  static async findAvailableRooms(
    tenantId: string,
    startTime: Date,
    endTime: Date
  ): Promise<IRoom[]> {
    try {
      return await Room.aggregate([
        // Match rooms for the tenant
        {
          $match: {
            tenant: new Types.ObjectId(tenantId),
          },
        },

        // Left join with meetings
        {
          $lookup: {
            from: 'meetings',
            let: { roomId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$room', '$$roomId'] },
                      {
                        $or: [
                          {
                            $and: [
                              { $lt: ['$startTime', endTime] },
                              { $gt: ['$endTime', startTime] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'conflictingMeetings',
          },
        },

        // Only keep rooms with no conflicts
        {
          $match: {
            conflictingMeetings: { $size: 0 },
          },
        },
      ]);
    } catch (error: any) {
      throw new Error(`Error finding available rooms: ${error.message}`);
    }
  }

  static async validateBooking(
    roomId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    const conflictingMeetings = await Meeting.findOne({
      room: roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $gte: startTime, $lt: endTime } },
      ],
    });
    return !conflictingMeetings;
  }

  static async bookRoom(
    roomId: string,
    tenantId: string,
    title: string,
    startTime: Date,
    endTime: Date
  ): Promise<IMeeting> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if room exists and belongs to tenant
      const room = await Room.findOne({
        _id: roomId,
        tenant: tenantId,
      }).session(session);

      if (!room) {
        throw new Error('Room not found or does not belong to tenant');
      }

      // Check for conflicts within the transaction
      const hasConflict = await Meeting.findOne({
        room: roomId,
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
          { startTime: { $gte: startTime, $lt: endTime } },
        ],
      }).session(session);

      if (hasConflict) {
        throw new Error('Room is already booked for this time period');
      }

      // Create the booking
      const meeting = await Meeting.create(
        [
          {
            room: roomId,
            tenant: tenantId,
            title,
            startTime,
            endTime,
          },
        ],
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      return meeting[0];
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  }

  static async getBookings(
    tenantId: string,
    filters?: {
      startTime?: Date;
      endTime?: Date;
      roomId?: string;
    }
  ): Promise<IMeeting[]> {
    try {
      // Build query object
      const query: any = { tenant: tenantId };

      // Add time filters if provided
      if (filters?.startTime || filters?.endTime) {
        query.$or = [
          {
            startTime: {
              $gte: filters.startTime,
              ...(filters.endTime && { $lt: filters.endTime }),
            },
          },
          {
            endTime: {
              $gt: filters.startTime,
              ...(filters.endTime && { $lte: filters.endTime }),
            },
          },
        ];
      }

      // Add room filter if provided
      if (filters?.roomId) {
        query.room = filters.roomId;
      }

      // Get bookings with populated room details
      return await Meeting.find(query)
        .populate('room', 'name capacity features')
        .sort({ startTime: 1 })
        .exec();
    } catch (error: any) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
  }
}

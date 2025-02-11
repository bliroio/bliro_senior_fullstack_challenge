import express, { Request, Response } from 'express';
import { RoomService } from '../services/roomService';

const router = express.Router();

/**
 * @swagger
 * /api/rooms/available:
 *   get:
 *     summary: Get available rooms for a time period
 *     parameters:
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: header
 *         name: tenant-id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available rooms
 */
router.get('/available', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['tenant-id'] as string;
    const startTime = new Date(req.query.startTime as string);
    const endTime = new Date(req.query.endTime as string);

    // Input validation
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ error: 'Start time must be before end time' });
    }

    const availableRooms = await RoomService.findAvailableRooms(
      tenantId,
      startTime,
      endTime
    );

    res.json(availableRooms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{roomId}/book:
 *   post:
 *     summary: Book a room for a specific time period
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: tenant-id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startTime
 *               - endTime
 *             properties:
 *               title:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 */
router.post('/:roomId/book', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const tenantId = req.headers['tenant-id'] as string;
    const { title, startTime, endTime } = req.body;

    // Input validation
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        error: 'Title, start time, and end time are required',
      });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (startDate >= endDate) {
      return res.status(400).json({
        error: 'Start time must be before end time',
      });
    }

    const booking = await RoomService.bookRoom(
      roomId,
      tenantId,
      title,
      startDate,
      endDate
    );

    res.status(201).json(booking);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('already booked')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/rooms/bookings:
 *   get:
 *     summary: Get all bookings with optional time period filter
 *     parameters:
 *       - in: header
 *         name: tenant-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startTime
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: roomId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['tenant-id'] as string;
    const { startTime, endTime, roomId } = req.query;

    // Input validation
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Build filters object
    const filters: {
      startTime?: Date;
      endTime?: Date;
      roomId?: string;
    } = {};

    if (startTime) {
      filters.startTime = new Date(startTime as string);
    }
    if (endTime) {
      filters.endTime = new Date(endTime as string);
    }
    if (roomId) {
      filters.roomId = roomId as string;
    }

    const bookings = await RoomService.getBookings(tenantId, filters);
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

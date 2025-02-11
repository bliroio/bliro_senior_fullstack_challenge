import express from 'express';
import meetingController from '../controllers/meetingController';

const router = express.Router();

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: The meeting was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       500:
 *         description: Some server error
 */
router.post('/', meetingController.createMeeting);

/**
 * @swagger
 * /api/meetings/{id}:
 *   get:
 *     summary: Get a meeting by ID
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The meeting id
 *     responses:
 *       200:
 *         description: The meeting description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 *       500:
 *         description: Some server error
 */
router.get('/:id', meetingController.getMeeting);

/**
 * @swagger
 * /api/meetings/{id}:
 *   put:
 *     summary: Update a meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The meeting id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       200:
 *         description: The meeting was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', meetingController.updateMeeting);

/**
 * @swagger
 * /api/meetings/{id}:
 *   delete:
 *     summary: Delete a meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The meeting id
 *     responses:
 *       200:
 *         description: The meeting was deleted
 *       404:
 *         description: Meeting not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id', meetingController.deleteMeeting);

/**
 * @openapi
 * /api/meetings:
 *   get:
 *     summary: Lists all the meetings with pagination
 *     tags: [Meetings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter meetings by title
 *     responses:
 *       200:
 *         description: Paginated list of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meeting'
 *                 totalDocs:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 page:
 *                   type: number
 *                 pagingCounter:
 *                   type: number
 *                 hasPrevPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 prevPage:
 *                   type: number
 *                   nullable: true
 *                 nextPage:
 *                   type: number
 *                   nullable: true
 *       500:
 *         description: Server error
 */
router.get('/', meetingController.listMeetings);

export default router;

import mongoose from 'mongoose';
import Meeting from './models/meeting';
import Tenant from './models/tenant';
import Room from './models/room';

const dbUri = process.env.MONGODB_URI || 'fallback_default_mongodb_uri';

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log('MongoDB connected...');

    // Optional: Clear existing data and insert dummy data
    await resetDatabase();

    console.log('Database reset completed...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to reset database
const resetDatabase = async () => {
  try {
    // Clear existing data
    await Promise.all([
      Meeting.deleteMany({}),
      Room.deleteMany({}),
      Tenant.deleteMany({}),
    ]);

    // Create a test tenant
    const tenant = await Tenant.create({
      name: 'Test Tenant',
      description: 'Test Tenant Description',
    });

    console.log('Tenant created:', tenant);

    // Create some rooms
    const rooms = await Room.insertMany([
      {
        tenant: tenant._id,
        name: 'Conference Room A',
        capacity: 10,
        features: new Map([
          ['hasProjector', true],
          ['hasVideoConference', true],
        ]),
      },
      {
        tenant: tenant._id,
        name: 'Meeting Room B',
        capacity: 6,
        features: new Map([['hasWhiteboard', true]]),
      },
    ]);

    // Create some meetings
    const now = new Date();
    const meetings = [];

    for (let i = 0; i < 10; i++) {
      const startTime = new Date(now.getTime() + i * 2 * 60 * 60 * 1000); // Every 2 hours
      meetings.push({
        room: rooms[i % rooms.length]._id,
        tenant: tenant._id,
        title: `Meeting ${i + 1}`,
        startTime,
        endTime: new Date(startTime.getTime() + 60 * 60 * 1000), // 1 hour duration
      });
    }

    await Meeting.insertMany(meetings);
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export default connectDB;

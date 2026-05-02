import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/db/db.js';
import { startContactScheduler } from './src/services/contact.scheduler.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const startServer = async () => {
  await connectDB();
  startContactScheduler();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});


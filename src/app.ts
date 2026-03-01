import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import applicationRoutes from './routes/application.routes';
import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import jobRoutes from './routes/job.routes';
import jobCategoryRoutes from './routes/jobCategory.routes';
import jobTypeRoutes from './routes/jobType.routes';
import locationRoutes from './routes/location.routes';
import statsRoutes from './routes/stats.routes';

dotenv.config();

const app = express();

// Connect DB on every request (serverless safe)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS for frontend
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];
      // Allow requests with no origin, or if they match our list, or if they are Vercel domains
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies to be sent
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/job-categories', jobCategoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/job-types', jobTypeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;

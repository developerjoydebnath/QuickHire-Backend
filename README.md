# QuickHire Backend

This is the backend server for the QuickHire platform, a job board and applicant tracking system. It provides a RESTful API for user authentication, job management, company profiles, and application handling.

## Tech Stack
- **Node.js** & **Express**
- **TypeScript**
- **MongoDB** & **Mongoose**
- **JWT** (JSON Web Tokens) for authentication
- **Bcrypt.js** for password hashing

## Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB account (or local MongoDB server)

## Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root of the backend directory (or copy from `.env.example` if available) and add the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI="mongodb+srv://db_user:JoyPortfolio5441%40%40%23%23%24@cluster0.zmln02u.mongodb.net/qtech-test"
   JWT_SECRET="ef7a8a4a5762fc85e79632b62effd5d880f57b6bd8996495fab9cd0798d0d1df"
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

## Scripts
- `npm run dev` - Starts the development server with live reload (`ts-node-dev`).
- `npm run build` - Compiles the TypeScript code to JavaScript in the `dist/` directory.
- `npm run start` - Runs the compiled production server.

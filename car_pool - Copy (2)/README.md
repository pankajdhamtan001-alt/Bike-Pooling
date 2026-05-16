# UrbanBike - Bicycle Pooling Application

A platform that allows users to connect with other cyclists and share rides in urban areas.

## Features

- User authentication with email/password and Google sign-in
- Profile management
- Ride creation and management 
- Responsive design for mobile and desktop
- Clean, modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- MongoDB (see setup instructions below)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB:
   - Option 1: Use a local MongoDB instance
     - Install MongoDB Community Edition on your machine
     - Start MongoDB service: `mongod --dbpath=/data/db`
     - Set `USE_LOCAL_MONGODB=true` in your `.env.local` file
   
   - Option 2: Use MongoDB Atlas (cloud)
     - Create a free MongoDB Atlas cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Get your connection string from Atlas dashboard
     - Set `MONGODB_URI=your_mongodb_connection_string` in `.env.local`
     - Set `USE_LOCAL_MONGODB=false` in `.env.local`

4. Set up environment variables:
   - Create a `.env.local` file in the root directory if it doesn't exist
   - Add the following variables:
```
MONGODB_URI=your_mongodb_connection_string
USE_LOCAL_MONGODB=true
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
GOOGLE_CLIENT_ID=your_google_client_id 
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Troubleshooting

If you encounter any issues with the MongoDB connection:
- Ensure your MongoDB service is running (for local setup)
- Check the connection string in `.env.local`
- Verify network connectivity to MongoDB Atlas (for cloud setup)
- Check the MongoDB port (default is 27017)

If you have issues with the "Offer Ride" or "Find Ride" functionality:
- Make sure you're logged in (these features require authentication)
- Ensure your MongoDB connection is working properly
- Check the browser console for any JavaScript errors

## Authentication Setup

### Google Authentication

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Configure the consent screen
6. Create the OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins: http://localhost:3001
   - Authorized redirect URIs: http://localhost:3001/api/auth/callback/google
7. Copy your Client ID and Client Secret to your `.env.local` file

## Project Structure

- `/src/app` - Next.js app directory
- `/src/components` - Reusable components
- `/src/lib` - Utility functions and database connections
- `/src/models` - MongoDB models
- `/src/providers` - React context providers
- `/src/types` - TypeScript type definitions

## Technologies Used

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- MongoDB & Mongoose
- NextAuth.js for authentication

## License

This project is licensed under the MIT License.

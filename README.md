# Transaction Dashboard

A MERN stack application that displays and analyzes transaction data with various visualizations.

## Features

- Transaction listing with search and pagination
- Monthly statistics
- Bar chart showing price range distribution
- Pie chart showing category distribution
- Combined data view
- Responsive design

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- Chart.js
- Tailwind CSS

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run server
   ```
5. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/seed` - Initialize database with seed data
- `GET /api/transactions` - List transactions with search and pagination
- `GET /api/statistics` - Get monthly statistics
- `GET /api/bar-chart` - Get price range distribution data
- `GET /api/pie-chart` - Get category distribution data
- `GET /api/combined` - Get combined data from all endpoints

## Project Structure

```
├── server/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── index.js
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── App.tsx
└── README.md
```
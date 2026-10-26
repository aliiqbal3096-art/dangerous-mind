
const express = require('express');
const { connectDB } = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the server to read JSON request bodies
app.use(express.json());

// Basic route to confirm the backend is working
app.get('/', (req, res) => {
  res.json({
    message: 'DANGEROUS MIND backend is running.'
  });
});

// Connect API routes
app.use('/api', healthRoutes);
app.use('/api', profileRoutes);

// Connect to MongoDB before accepting requests
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`DANGEROUS MIND API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exitCode = 1;
  }
}

startServer();

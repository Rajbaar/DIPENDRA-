const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

// Try MongoDB, fallback to in-memory
let useMongoDB = false;
try {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/steptrendy')
    .then(() => { console.log('MongoDB connected'); useMongoDB = true; })
    .catch(err => { console.log('MongoDB unavailable, using in-memory DB:', err.message); });
} catch (e) {
  console.log('Mongoose not available, using in-memory DB');
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, message: 'Too many requests' });
app.use('/api/', limiter);

app.set('io', io);

// Dynamic route loading - try MongoDB models first, fallback to memoryDB
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/banners', require('./routes/banners'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: useMongoDB ? 'mongodb' : 'in-memory', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('join-admin', () => socket.join('admin-room'));
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message || err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`StepTrendy API running on port ${PORT} (DB: ${useMongoDB ? 'MongoDB' : 'In-Memory'})`);
});

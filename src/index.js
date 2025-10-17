// // const mongoose = require('mongoose');
// // const app = require('./app');
// // const config = require('./config/config');
// // const logger = require('./config/logger');

// // let server;
// // mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
// //   logger.info('Connected to MongoDB');
// //   server = app.listen(config.port, () => {
// //     logger.info(`Listening to port ${config.port}`);
// //   });
// // });

// // const exitHandler = () => {
// //   if (server) {
// //     server.close(() => {
// //       logger.info('Server closed');
// //       process.exit(1);
// //     });
// //   } else {
// //     process.exit(1);
// //   }
// // };

// // const unexpectedErrorHandler = (error) => {
// //   logger.error(error);
// //   exitHandler();
// // };

// // process.on('uncaughtException', unexpectedErrorHandler);
// // process.on('unhandledRejection', unexpectedErrorHandler);

// // process.on('SIGTERM', () => {
// //   logger.info('SIGTERM received');
// //   if (server) {
// //     server.close();
// //   }
// // });
// const http = require('http');
// const mongoose = require('mongoose');
// const app = require('./app');

// const PORT = 3000;

// // connect MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/voice-medical', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.log('MongoDB connection error:', err));

// // start server
// app.listen(PORT, () => {
//   console.log(`Listening to port ${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/v1/user.route');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

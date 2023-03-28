require('dotenv').config();
require('express-async-errors');
// server
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const port = process.env.PORT || 5000;

// all imports
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const cors = require('cors');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('express-rate-limit');
// routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
// middle wares
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

// setting up middle wares
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windows: 16 * 15 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xssClean());
app.use(mongoSanitize());
app.use(express.static('./public'));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
// testing route
app.get('/', (req, res) => {
  res.send('E-commerce-api');
});
app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.send(req.signedCookies);
});
app.use(notFound);
app.use(errorHandler);
const start = () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

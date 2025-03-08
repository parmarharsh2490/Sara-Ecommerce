import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import { verifyJWT } from './middleware/auth.middleware.js';
import sellerRouter from './routes/seller.routes.js';
import addressRouter from './routes/address.routes.js';
import productReviewRouter from './routes/ProductReview.routes.js';
import wishListRouter from './routes/wishlist.routes.js';
import cartRouter from './routes/cart.routes.js';
import orderRouter from './routes/Order.routes.js';
import { promotionalRouter } from './routes/Promotional.routes.js';
import { paymentWalletRouter } from './routes/paymentWallet.routes.js';
import compression from "compression"
import { generateSitemapXml } from './utils/generateSitemapXml.js';
const app = express();

app.use(compression());
// Middleware

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS settings
const allowedOrigins = [
  'http://localhost:5173',
  'https://sara-ecommerce.vercel.app',
  'https://shopy-ecommce.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));

// // Static file serving
// const __dirname = path.resolve();
// // Static file serving
// app.use(express.static(path.join(__dirname, 'public'))); // Adjust the path as needed



// Routes
app.get('/', (_, res) => {
  res.send('Hello, world!');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/productReview', verifyJWT, productReviewRouter);
app.use('/api/v1/seller', verifyJWT, sellerRouter);
app.use('/api/v1/cart', verifyJWT, cartRouter);
app.use('/api/v1/order', verifyJWT, orderRouter);
app.use('/api/v1/wishlist', verifyJWT, wishListRouter);
app.use('/api/v1/address', verifyJWT, addressRouter);
app.use('/api/v1/promotional', verifyJWT, promotionalRouter);
app.use('/api/v1/paymentwallet', verifyJWT, paymentWalletRouter);
app.get('/sitemap.xml', generateSitemapXml);

export default app;

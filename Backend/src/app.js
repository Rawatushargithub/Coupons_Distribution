import express from 'express';
import cors from "cors";

import cookieParser from "cookie-parser";
const app = express();

// Middleware
app.use(express.json()); 
app.use(cookieParser());

app.use(cors({
    origin: "https://coupons-distribution-frontend.onrender.com",
    credentials: true
}))

// Routes
import couponRoutes from "./routes/Coupon.routes.js";

app.use("/api/v1/coupons", couponRoutes);

export default app;


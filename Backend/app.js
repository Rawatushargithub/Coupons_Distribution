import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db_config/db.js';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from "./routes/event.routes.js"
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;


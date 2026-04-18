import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import songRoutes from "./routes/song.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

/**
 * Routes
 */

app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)

export default app;
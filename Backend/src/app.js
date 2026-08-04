import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// import authRoutes from "./routes/auth.routes";
// import songRoutes from "./routes/song.routes";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
     origin: "http://localhost:5173",
     methods: [ "GET", "POST", "PUT", "DELETE" ],
     credentials: true
}))

/**
 * Routes
 */

app.get("/", (_req, res) => {
     res.status(200).json({ message: "Server is Running" });
});

// app.use("/api/auth", authRoutes)
// app.use("/api/songs", songRoutes)

export default app;
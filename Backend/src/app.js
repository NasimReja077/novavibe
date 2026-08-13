import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import songRoutes from "./routes/song.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import recentlyPlayedSongRoutes from "./routes/recentlyPlayedSong.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";


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

app.use(passport.initialize());

passport.use(new GoogleStrategy({
     clientID: config.GOOGLE_CLIENT_ID,
     clientSecret: config.GOOGLE_CLIENT_SECRET,
     callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
     return done(null, profile);
}))

app.get("/", (_req, res) => {
     res.status(200).json({ message: "Server is Running" });
});

app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)
app.use("/api/bookmarks", bookmarkRoutes)
app.use("/api/recently-played", recentlyPlayedSongRoutes)
app.use("/api/playlists", playlistRoutes)

export default app;
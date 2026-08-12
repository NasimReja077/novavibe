import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { register, login, getMe, logout, googleCallback, refresh } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

router.post('/register', validateRegisterUser, register);
router.post("/login", validateLoginUser, login);
router.post("/logout", authenticateUser, logout);
router.get('/me', authenticateUser, getMe);

router.post("/refresh", refresh);

router.get("/google", 
     passport.authenticate("google", { scope: [ "profile", "email" ] })
)

router.get("/google/callback", 
     passport.authenticate("google", { 
          session: false,
          failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
     }),
     googleCallback,
)

export default router;
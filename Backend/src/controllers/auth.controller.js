import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import redis from "../config/cache.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils.js";

async function sendTokenResponse(user, res, message) {
     const accessToken = generateAccessToken(user);
     const refreshToken = generateRefreshToken(user);

     res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000 // 15 minutes
     })

     res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
     })

     res.status(200).json({
          message,
          success: true,
          user: {
               id: user._id,
               email: user.email,
               username: user.username
          }
     })
}

export const register = async (req, res) => {
     const { email, password, username } = req.body;
     try {
          const existingUser = await userModel.findOne({
               $or: [
                    { email },
                    { username }
                
               ]
          })

          if (existingUser){
               return res.status(400).json({
                    message: "User with this email or username already exists"
               });
          }

          const user = await userModel.create({
               email,
               password,
               username
               
          })

          await sendTokenResponse(user, res, "User Registered Successfully")
     } catch (error) {
          console.log(error)
          return res.status(500).json({ message: "Server Error" });
     }
}

export const login = async (req, res) => {
     const { email, password } = req.body;

     const user = await userModel.findOne({ email });

     if (!user){
          return res.status(400).json({
               message: "Invalid email or password"
          });
     }
     
     const isMatch = await user.comparePassword(password);

     if (!isMatch){
          return res.status(400).json({ message: "Invalid email or password" });
     }

     await sendTokenResponse(user, res, "User logged in successfully");
}

export const googleCallback = async (req, res) => {
     try {
          // console.log(req.user)
     const { id, displayName, emails, photos } = req.user
     const email = emails[0].value;
     // const profilePic = photos?[0]?.value;

     let user = await userModel.findOne({
          email
     })

     if (!user){

          const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
          let username = baseUsername;
          let suffix = 0;
          while (await userModel.findOne({ username })) {
               suffix += 1;
               username = `${baseUsername}${suffix}`;
          }

          user = await userModel.create({
               email,
               googleID: id,
               fullname: displayName,
               username,
          })
     }
     const accessToken = generateAccessToken(user);
     const refreshToken = generateRefreshToken(user);

     res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000
     })

     res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000
     })

     res.redirect("http://localhost:5173/")
     } catch (error) {
          console.error("Google auth error:", error);
          res.redirect(config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login");
     }
}

export const getMe = async (req, res) => {
     const user = req.user;

     res.status(200).json({
          message: "User fetched successfully",
          success: true,
          user: {
               id: user._id,
               email: user.email,
               username: user.username
          }
     })
}


export const logout = async (req, res) => {
     const accessToken = req.cookies?.accessToken;
     const refreshToken = req.cookies?.refreshToken;

     res.clearCookie("accessToken", {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "lax"
     });

     res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "lax"
     });

     if (!accessToken && !refreshToken) {
          return res.status(200).json({ message: "Logout successful." });
     }

     try {
          if (accessToken) {
               const decoded = jwt.verify(accessToken, config.JWT_SECRET);
               const expiresInSeconds = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0);
               if (expiresInSeconds > 0) {
                    await redis.set(`blacklist:${accessToken}`, "true", "EX", expiresInSeconds);
               }
          }

          if (refreshToken) {
               const decodedRefresh = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
               const expiresInSeconds = Math.max(decodedRefresh.exp - Math.floor(Date.now() / 1000), 0);
               if (expiresInSeconds > 0) {
                    await redis.set(`blacklist:${refreshToken}`, "true", "EX", expiresInSeconds);
               }
          }
     } catch (error) {
          // Tokens may already be invalid/expired; cookies are cleared regardless.
     }

     res.status(200).json({ message: "Logout successful." });
}

export const refresh = async (req, res) => {
     const refreshToken = req.cookies?.refreshToken || (
          req.headers.authorization?.startsWith("Bearer ")
               ? req.headers.authorization.split(" ")[1]
               : undefined
     );

     if (!refreshToken) {
          return res.status(401).json({ message: "Refresh token not provided" });
     }

     try {
          const isBlacklisted = await redis.get(`blacklist:${refreshToken}`);
          if (isBlacklisted) {
               return res.status(401).json({ message: "Invalid or revoked refresh token" });
          }

          const decoded = verifyRefreshToken(refreshToken);
          const user = await userModel.findById(decoded.id);

          if (!user) {
               return res.status(401).json({ message: "Invalid refresh token" });
          }

          // Rotate tokens: issue new access and refresh tokens
          const newAccessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken(user);

          // Set cookies
          res.cookie("accessToken", newAccessToken, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "lax",
               maxAge: 15 * 60 * 1000 // 15 minutes
          });

          res.cookie("refreshToken", newRefreshToken, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "lax",
               maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });

          // Blacklist old refresh token until its expiry
          const expiresInSeconds = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0);
          if (expiresInSeconds > 0) {
               await redis.set(`blacklist:${refreshToken}`, "true", "EX", expiresInSeconds);
          }

          return res.status(200).json({ message: "Token refreshed", success: true });
     } catch (err) {
          return res.status(401).json({ message: "Invalid refresh token" });
     }
}
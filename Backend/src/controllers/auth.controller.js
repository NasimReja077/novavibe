import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import redis from "../config/cache.js";

async function sendTokenResponse(user, res, message) {
     const token = jwt.sign({
          id: user._id,
     }, config.JWT_SECRET, {
          expiresIn: "7d"
     })

     res.cookie("token", token, {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000
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
     // console.log(req.user)

     const { id, displayName, emails, photos } = req.user
     const email = emails[0].value;
     const profilePic = photos[0].value;

     let user = await userModel.findOne({
          email
     })

     if (!user){
          user = await userModel.create({
               email,
               googleID: id,
               fullname: displayName,
          })
     }

     const token = jwt.sign({
          id: user._id,
     }, config.JWT_SECRET, {
          expiresIn: "7d"
     })

     res.cookie("token", token)
     
     res.redirect("http://localhost:5173/")
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
    const token = req.cookies?.token;

    res.clearCookie("token", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax"
    });

    if (!token) {
        return res.status(200).json({
            message: "Logout successful."
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const expiresInSeconds = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0);

        if (expiresInSeconds > 0) {
            await redis.set(`blacklist:${token}`, "true", "EX", expiresInSeconds);
        }
    } catch (error) {
        // Token already invalid or expired, but cookie is cleared.
    }

    res.status(200).json({
        message: "Logout successful."
    });
}
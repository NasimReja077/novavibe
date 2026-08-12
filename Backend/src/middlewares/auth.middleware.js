import userModel from "../models/user.model.js";
import redis from "../config/cache.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const { verify } = jwt;

export async function authenticateUser(req, res, next) {
    const token = req.cookies?.accessToken || (
        req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : undefined
    );

    if (!token) {
        return res.status(401).json({
            message: "Authentication token not provided"
        });
    }
    
    try {
        const isTokenBlacklisted = await redis.get(`blacklist:${token}`);

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Invalid or revoked token"
            });
        }

        const decoded = verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}
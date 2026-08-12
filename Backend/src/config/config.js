import dotenv from "dotenv";

dotenv.config();

const env = process.env;

if (!process.env.MONGODB_URI) {
     throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
     throw new Error("JWT_SECRET is not defined in environment variables");
}

const redisPort = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;

if (!process.env.GOOGLE_CLIENT_ID){
     throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables")
}

if (!process.env.GOOGLE_CLIENT_SECRET){
     throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables")
}

if (!process.env.IMAGEKIT_PRIVATE_KEY){
     throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in environment variables")
}


export const config = {
     MONGODB_URI: process.env.MONGODB_URI,
     JWT_SECRET: process.env.JWT_SECRET,
     JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
     GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
     GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
     IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
     NODE_ENV: process.env.NODE_ENV || "development",
     REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
     REDIS_PORT: Number.isNaN(redisPort) ? 6379 : redisPort,
     REDIS_PASSWORD: env.REDIS_PASSWORD || undefined
};
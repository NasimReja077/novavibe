import Redis from "ioredis"
import { config } from "./config.js"

const redisOptions = {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
};

if (config.REDIS_PASSWORD) {
    redisOptions.password = config.REDIS_PASSWORD;
}

const redis = new Redis(redisOptions);

redis.on("connect", () => {
    console.log("server is connected to redis")
})

redis.on("error", (err) => {
    console.log(err)
})

export default redis
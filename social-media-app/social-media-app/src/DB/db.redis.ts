import { createClient } from "redis"
import {REDIS_URI} from "../config/config.service.js"
import {RedisClientType} from '@redis/client'
 export const redisclient: RedisClientType = createClient({
  url: REDIS_URI as string
});
export const redisconnection = async () => {
    redisclient.on("error", (err) => {
        console.error('Redis client error:', err)
    });

    try{
        await redisclient.connect()
        console.log('redis connected successfully')
    }catch(err){
        console.error(`Failed to connect to Redis: ${err}`)
        throw err
    }
}
import {Queue} from 'bullmq'
import dotenv from 'dotenv'

dotenv.config()

const redisConnection={
    host:process.env.REDIS_HOST || 'localhost',
    port:process.env.REDIS_PORT || 6379,
}

export const generationQueue=new Queue('generation-queue',{
    connection:redisConnection,
})
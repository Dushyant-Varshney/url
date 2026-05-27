import { createClient } from 'redis';

let redisClient: any = null;
let isRedisConnected = false;

export const initializeRedis = async () => {
    try {
        // Try to connect to Redis using REDIS_URL or individual host/port
        const redisUrl = process.env.REDIS_URL || 
            `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

        redisClient = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => Math.min(retries * 50, 500),
            },
        });

        redisClient.on('error', (err: Error) => {
            console.warn('Redis Client Error:', err);
            isRedisConnected = false;
        });

        redisClient.on('connect', () => {
            console.log('Redis connected successfully');
            isRedisConnected = true;
        });

        await redisClient.connect();
        isRedisConnected = true;
        console.log('Redis initialized successfully');
    } catch (error) {
        console.warn('Redis initialization failed. App will work without Redis caching:', error);
        isRedisConnected = false;
        redisClient = null;
    }
};

export const getRedisClient = () => redisClient;
export const isRedisAvailable = () => isRedisConnected;

export const closeRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
    }
};

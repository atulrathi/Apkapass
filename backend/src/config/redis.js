const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.redis_host
});

redisClient.on('error', (err) => {
  console.log('Redis Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
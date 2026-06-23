const dotenv = require("dotenv");
const redisClient = require("./config/redis");
dotenv.config();

const app = require("./app");
const http = require("http");
const connectDB = require("./config/connectdb");

connectDB();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 
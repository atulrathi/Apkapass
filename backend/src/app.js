const express = require("express");
const app = express();
const authRoutes = require("./Routes/auth");
const providerRoutes = require("./Routes/provider");
const cors = require("cors");
const Provider = require("./models/provider");
const cookieParser = require("cookie-parser");
const toggleroutes = require("./Routes/toggleroute");
const serviceRoutes = require("./Routes/servicesroute");
const getno = require("./Routes/getno");

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/provider",providerRoutes);
app.use("/toggle",toggleroutes);
app.use("/service",serviceRoutes);
app.use("/number",getno);

module.exports = app;
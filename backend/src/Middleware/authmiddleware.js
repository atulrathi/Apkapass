const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }


    req.user = decoded;
    next();
    
  } catch (err) {
    // We removed the console.error(err) here!
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    // Optional: Log actual bad tokens if someone is tampering
    console.log("Invalid token attempt detected.");
    return res.status(403).json({ message: "Invalid token" });
  }
};
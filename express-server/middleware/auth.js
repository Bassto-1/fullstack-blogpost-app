const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  //  Get the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }
  // Get the token
  const token = authHeader.split(" ")[1];

  try {
    //  Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.userId).select("_id role");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.userId = user._id.toString();
    req.userRole = user.role;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth; 
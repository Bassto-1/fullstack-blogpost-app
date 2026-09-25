const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {

  //  Get the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
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
    console.log("DECODED TOKEN:", decoded)
    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth; 
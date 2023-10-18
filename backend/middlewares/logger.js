require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  // console.log(token);
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Authentication failed",
    });
  } else {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      }
      req.user = decoded;
      // console.log(decoded);
      next();
    });
  }
};

module.exports = { verifyToken };

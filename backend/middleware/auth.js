const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) return res.sendStatus(401); // unauthorized

  jwt.verify(token, process.env.JWT_SECRET || "MY_SECRET_KEY", (err, user) => {
    if (err) return res.sendStatus(403); // forbidden
    req.user = user; // attach user info to request
    next();
  });
}

module.exports = authenticateToken;

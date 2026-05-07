const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT token for a given user ID.
 * Token expires in 7 days.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = generateToken;

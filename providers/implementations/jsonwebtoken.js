const jwt = require("jsonwebtoken");

const configureJWT = async (user) => {
  return jwt.sign(user, process.env.SECRET);
};

const validUser = async (token) => {
  return jwt.verify(token, process.env.SECRET);
};

module.exports = {
  configureJWT,
  validUser,
};

const { config } = require("dotenv");
const bcrypt = require("bcrypt");
const { findByEmail } = require("../../database/implementations/mongoRepository");

config();

if (!process.env.SECRET) {
  throw new Error(
    "Provide a enviroment variable called SECRET for JSON WEB TOKEN!!!",
  );
}

const comparePass = async (email, password) => {
  const user = await findByEmail(email);
  const dbPassword = user.password;
  return bcrypt.compare(password, dbPassword);
};

const encrypt = async (pass) => {
  return bcrypt.hash(pass, 13);
};

module.exports = {
  comparePass,
  encrypt,
};

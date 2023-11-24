const { config } = require("dotenv");
const { findByEmail } = require('../../implementations/mongoRepository')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

config();

if (!process.env.SECRET) {
  throw new Error(
    "Provide a enviroment variable called SECRET for JSON WEB TOKEN!!!",
  );
}

const encrypt = async (pass) => {
    return await bcrypt.hash(pass, 13)
};

const comparePass = async (email, password) => {
    const user = await findByEmail(email)
    const db_password = user.password
    return await bcrypt.compare(password, db_password)
}

const configureJWT = async (user) => {
    return jwt.sign(user, process.env.SECRET)
}

const validUser = async (token) => {
    return jwt.verify(token, process.env.SECRET)
}

module.exports = {
    comparePass,
    configureJWT,
    encrypt,
    validUser
}
const express = require("express");
const {
  findByEmail,
  save,
  updateLastLogin,
  findByID,
} = require("./database/implementations/mongoRepository");

const { encrypt, comparePass } = require("./providers/implementations/bcrypt");
const {
  configureJWT,
  validUser,
} = require("./providers/implementations/jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userAlreadyExist = await findByEmail(email);
  if (!userAlreadyExist) {
    return res.status(404).json({ message: "Usúario e/ou senha inválidos" });
  }

  const validPass = await comparePass(email, password);
  if (!validPass) {
    return res.status(404).json({ message: "Usuário e/ou senha inválidos" });
  }

  const token = await configureJWT(email);
  const updatedUser = await updateLastLogin(email);
  return res.status(200).json({
    // eslint-disable-next-line no-underscore-dangle
    id: updatedUser._id,
    createdAt: updatedUser.createdAt,
    updatedDate: updatedUser.updateDate,
    lastLogin: updatedUser.lastLogin,
    token,
  });
});

router.post("/register", async (req, res) => {
  const { email, password, name, number, ddd } = req.body;
  const date = new Date();
  const actualDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const userAlreadyExist = await findByEmail(email);
  if (userAlreadyExist) {
    return res.status(400).json({ message: "Email já existente" });
  }

  const encryptedPass = await encrypt(password);
  const token = await configureJWT(email);

  const userData = {
    email,
    phones: [{ number, ddd }],
    name,
    password: encryptedPass,
    createdAt: actualDate,
    lastLogin: actualDate,
    updateDate: actualDate,
  };

  const newUser = await save(userData);

  return res.status(201).json({
    // eslint-disable-next-line no-underscore-dangle
    id: newUser._id,
    createdAt: newUser.createdAt,
    lastLogin: newUser.lastLogin,
    updateDate: newUser.updateDate,
    token,
  });
});

router.get("/user/:id", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(405).json({ message: "Não autorizado" });
  }

  if (!validUser(req.headers.authorization)) {
    return res.status(405).json({ message: "Não autorizado" });
  }

  if (!req.headers.token) {
    return res.status(405).json({ message: "Sessão inválida" });
  }

  if (!validUser(req.headers.token)) {
    res.status(405).json({ message: "Sessão inválida" });
  }

  const { id } = req.params;
  try {
    const user = await findByID(id);
    return res.status(200).json({
      // eslint-disable-next-line no-underscore-dangle
      id: user._id,
      createdAt: user.createdAt,
      updateDate: user.updateDate,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: error.message || "Unexpected error" });
  }
});

module.exports = router;

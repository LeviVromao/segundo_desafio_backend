const { userModel, mongoose } = require("../mongo");

// eslint-disable-next-line consistent-return
const findByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    console.error(error);
  }
};

// eslint-disable-next-line consistent-return
const findByID = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Usuário inválido.");
  }
  const user = await userModel.findById(id);
  if (!user) {
    throw new Error("Usuário inválido.");
  }

  return user;
};

const updateLastLogin = async (email) => {
  const date = new Date();
  const actualDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const user = await findByEmail(email);
  const updatedUser = await userModel.findOneAndUpdate(
    { email: user.email },
    {
      lastLogin: actualDate,
      updatedAt: actualDate,
    },
  );

  await updatedUser.save();
  return updatedUser;
};

// eslint-disable-next-line consistent-return
const save = async (user) => {
  try {
    // eslint-disable-next-line new-cap
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  findByEmail,
  save,
  updateLastLogin,
  findByID,
};

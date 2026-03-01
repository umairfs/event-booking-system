const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const registerUser = async ({ name, email, password }) => {

  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await userRepository.createUser({
    name,
    email,
    password: hashedPassword
  });

  return userId;
};


const loginUser = async ({ email, password }) => {

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};

module.exports = {
  registerUser,
  loginUser
};
const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error(error);
  }
};

exports.comparePassword = async (password, hashPassword) => {
  try {
    const match = await bcrypt.compare(password, hashPassword);
    return match;
  } catch (error) {
    console.error(error);
  }
};

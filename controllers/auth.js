const User = require("../models/users");
const { hashPassword, comparePassword } = require("../utils/auth");
const ErrorResponse = require("../utils/ErrorResponse");
exports.register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!name || !email || !password) {
      res.status(422).json({
        success: false,
        message: "All  fields are required",
      });
    }

    // Check is email is taken
    const exist = await User.findOne({ email });
    if (exist) next(new ErrorResponse("Email already taken", 422));

    // hash password
    const hashpassword = await hashPassword(password);
    // save user to db
    const user = await new User({ name, email, password: hashpassword }).save();
    res.status(200).json({
      success: true,
      message: "Registration succesful",
    });
  } catch (error) {
    next(error);
  }
};

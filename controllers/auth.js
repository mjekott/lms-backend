const jwt = require("jsonwebtoken");
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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(422).json({
        success: false,
        message: "All  fields are required",
      });
    }

    // Check if user exist in db
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse("Invalid Credentials", 422));

    // Check if password match the dound users
    const match = await comparePassword(password, user.password);
    if (!match) return next(new ErrorResponse("Invalid Credentials", 422));

    // create token payload
    const payload = {
      _id: user._id,
    };

    // create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // send token in http cookie
    res.cookie("token", token, {
      httpOnly: true,
      //secure: true, // only works on https
    });

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Signout successfully",
    });
  } catch (error) {
    next(error);
  }
};

const { validationResult } = require("express-validator");
const userService = require("../services/user.service");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = await userService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId
    });

  } catch (error) {

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const login = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const token = await userService.loginUser(req.body);

    res.status(200).json({
      success: true,
      token
    });

  } catch (error) {

    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  register,
  login
};
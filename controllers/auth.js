const User = require("../models/User");
const slugify = require("slugify");

const sendEmail = require("../utils/sendVerificationEmail");

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next({
      message: "Please Enter Name, Email, and Password",
      statusCode: 400,
    });
  }

  let slug = slugify(name, { lower: true });

  // check for existing slug and add id if same slug already exists
  const user = await User.find({ slug: new RegExp(slug) }).sort("createdAt");
  if (user.length > 0) {
    let lastNumber = parseInt(user[user.length - 1].slug.split("-")[2]) || 0;
    slug = `${slug}-${lastNumber + 1}`;
  }

  try {
    // create user
    const user = await User.create({
      name,
      email,
      password,
      slug,
    });

    const token = user.getSignedJwtToken();

    await sendEmail(user, token);

    res.status(200).json({
      success: true,
      message:
        "An email has been sent to your inbox. Click the link the the email to verify your account",
    });
  } catch (err) {
    next(err);
  }
};

// @desc Verify User
// @route POST /api/v1/auth/verify/:token
// @access Public
exports.verify = async (req, res, next) => {
  const { token } = req.params;
  res.status(200).json({ token });
};

// @desc LogIn User
// @route POST /api/v1/auth/login
// @access Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next({
      message: "Please provide an email and password",
      statusCode: 400,
    });
  }

  try {
    // Check for the user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({ message: "Invalid credentials", statusCode: 401 });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next({ message: "Invalid credentials", statusCode: 401 });
    }

    // Check for user verification
    if (!user.verified) {
      return next({
        message: "Please follow the link in your email to verify your account",
        statusCode: 401,
      });
    }

    // in stead of the last bit in this controller, the devcamper api uses this
    // in devcamper, this method is defined at the bottom of the auth.js file
    // seems like something that could be defined in its own file in a util.. food for thought
    // sendTokenResponse(user, 200, res);

    // create token
    // this user dot notation here gives you access to mongoose methods defined in the model/schema
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};

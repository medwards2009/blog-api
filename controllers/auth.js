const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const User = require("../models/User");

const sendEmail = require("../utils/sendVerificationEmail");

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

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
      role,
      slug,
    });

    const token = user.getSignedJwtToken();

    await sendEmail(user, token, next);

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

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(err);
    return;
  }

  try {
    // The third option in the function below "new" tells it to return
    // the value after the update not before. in this case, since we are
    // not assigning the the return value, it is useless, but i will leave
    // it here for future reference
    await User.findByIdAndUpdate(decoded.id, { verified: true }, { new: true });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
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

    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};

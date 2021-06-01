const User = require('../models/User');
const slugify = require('slugify');

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  let slug = slugify(name, { lower: true });

  const user = await User.find({ slug: new RegExp(slug) }).sort('createdAt');
  if (user.length > 0) {
    let lastNumber = parseInt(user[user.length - 1].slug.split('-')[2]) || 0;
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

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

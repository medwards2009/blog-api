const mongoose = require('mongoose');
const slugify = require('slugify');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  slug: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create User Slug from the name
// Note: an arrow function here will not work as the useage of the 'this' keyword would not be handles correctly. This is a scope thing
// UserSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   const userSlug = await
//   next();
// });

module.exports = mongoose.model('User', UserSchema);

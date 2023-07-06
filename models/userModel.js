const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, 'Please tell us your first name!'],
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your last name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },

      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  bookmarkedRecipes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipes',
    },
  ],
  lastVisitedAt: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipes',
    },
  ],
  pantry: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Ingredients',
    },
  ],
  shopping: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Ingredients',
    },
  ],
  planner: [
    {
      day: Number,
      dayOfWeek: String,
      breakfast: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Recipes',
        },
      ],
      lunch: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Recipes',
        },
      ],
      dinner: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Recipes',
        },
      ],
    },
  ],
});

// pre('save', async function (next)): This function hashes the user's password using bcryptjs
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// pre('save', function (next)): This function sets the passwordChangeAt property to the current date and time if the user's password has been modified since it was last saved to the database.
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

// correctPassword: This method compares a given password with the user's hashed password using bcryptjs.
userSchema.methods.correctPassword = async function (loginPass, userPassword) {
  return await bcrypt.compare(loginPass, userPassword);
};

// changedPasswordAfter: This method checks whether the user's password has been changed after a given timestamp.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// createPasswordResetToken : This method generates a random string using crypto and sets the passwordResetToken property to its hashed value.
// It also sets the passwordResetExpiry property to 10 minutes from the current date and time. It returns the unhashed password reset token.
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // change it to minutes
  this.passwordResetExpiry = Date.now() + 60 * 1000;

  return resetToken;
};

// create a Mongoose model called User using the userSchema schema.
const User = mongoose.model('User', userSchema);
module.exports = User;

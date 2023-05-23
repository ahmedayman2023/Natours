const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
/*
              it took me 10mins until it hit me as to why passwordChangeAt wasn't showing.

             const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
                passwordChangedAt: req.body.passwordChangedAt
              });
            In the signup middleware in the controller class, don't forget to add the passwordChangedAt property to the create method, since these are the only properties that will be persisted to the Database.
            */
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'guid', 'admin', 'lead-guid'],
  },
  name: {
    type: String,
    required: [true, 'the user must have name'],
  },
  email: {
    type: String,
    required: [true, 'the user must have email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please proveid a email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'the user must have password'],
    maxlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'the user must have confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      // validator: function () { // my wrong syntax
      //   return this.password;
      // },
      message: 'Please the Password should be same',
    },
  },
  passwordChangedAt: Date,
});
// -------------------------------------------------------------------------------------------------------
userSchema.pre('save', async function (next) {
  // Only run this function if password was acutally modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete password confirm field
  this.passwordConfirm = undefined;

  next();
  // // ---------- my wrong syntax ----------
  // modified.this //
  //   .password(bcrypt, 12);
  // // delete password
  // this.passwordConfirm = undefined;
});

/*
// ----------------------------------------------------------------------------------------------------------
candidate password (i.e., the password provided by the user during authentication) 
user password (i.e., the hashed password stored in the database).


*/
userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};
// ---------------------- Wrong Syntax-----------------------------
// userSchema.methods.correctPassword = async(condidatePassword, userPassword) {
//     return await bcryptcompare(condidatePassword, userPassword)
// }
// --------------------------------------------------------------------------------------------------------------

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = this.passwordChangedAt.getTime() / 1000;
    console.log(JWTTimestamp, changeTimestamp);
    return JWTTimestamp < changeTimestamp;
  }
  return false;
};

// --------------------------------------------------------------------------------------------------------------
const User = mongoose.model('User', userSchema);
module.exports = User;

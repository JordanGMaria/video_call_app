import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema({
    active: { type: Boolean, default: true },
    name: String,
    email: String,
    password: String,
    photo: {
        filename: String,
        mimetype: String,
        originalname: String,
        folder: { type: String, default: "users" },
        size: Number,
        encoding: String,
    }
});

Schema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
export default mongoose.model("User", Schema);

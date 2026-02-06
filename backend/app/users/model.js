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

Schema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", Schema);

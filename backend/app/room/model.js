import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  active: { type: Boolean, default: true },
  date: Date,
  root: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  participant: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Room", Schema);

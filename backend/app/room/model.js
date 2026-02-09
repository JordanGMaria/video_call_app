import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  active: { type: Boolean, default: true },
  date_start: Date,
  date_end: Date,
  owner: {
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

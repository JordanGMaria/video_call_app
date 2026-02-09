import mongoose from "mongoose";
import "../env/index.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const DB = process.env.DB || "mongodb://127.0.0.1:27017/wsmeet";


async function connect(attempt = 1) {
  try {
    await mongoose.connect(DB, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error(`❌ ERRO CONNECT MongoDB (attempt ${attempt}):`, err.message);

    if (attempt >= 5) {
      console.error("❌ QUIT");
      process.exit(1);
    }

    await sleep(10000);
    return connect(attempt + 1);
  }
}

connect();
export default connect;

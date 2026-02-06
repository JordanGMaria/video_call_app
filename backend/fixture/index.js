
import Model from "../app/users/model.js";
import mongoose from "mongoose";

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


async function start() {

    connect();
    
    const root = await Model.findOne({ email: "jordan@wsmeet.com.br"});
    if (!root) {
        console.log("cadastrando root");
        const novoUser = new Model({ email: 'jordan@wsmeet.com.br', password: '9*4dtJa/XW5Y', name: 'Jordan' });
        await novoUser.save();
    } else console.log("root já cadastrado");

    console.log('done');
}

start();
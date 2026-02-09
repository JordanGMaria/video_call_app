
import ("../core/connection/index.js");
import Model from "../app/users/model.js";

async function start() {

  console.log("START FIXTURE");

  const root = await Model.findOne({ email: "jordan@wsmeet.com.br" });
  if (!root) {
    console.log("registering root");
    const newUser = new Model({ email: 'jordan@wsmeet.com.br', password: '9*4dtJa/XW5Y', name: 'Jordan' });
    await newUser.save();
  } else console.log("root already registered");

  console.log('DONE');
}

start();
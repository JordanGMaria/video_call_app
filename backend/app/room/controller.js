import Model from "./model.js";
import mongoose from "mongoose";

export const index = async (req, res) => {
  const filtro = { active: true };

  const query = Model.find(filtro);

  if (!req.body.all) {
    query.skip(req.body.skip || 0);
    query.limit(req.body.limit || 25);
  }

  const data = await query.exec();
  const total = await Model.countDocuments(filtro);

  res.json({ total, data });
}

export const insert = async (req, res) => {

  req.body.root = req.body.root ? req.body.root : req.decoded._id;
  if(!req.body.root){
    return res.status(300).json({ success: false, data, err: "Host not found.", form: req.body });
  }

  const model = new Model(req.body);

  const data = await model.save();

  if (data) {
    res.json({ success: true, data, form: req.body });
  } else {
    res.status(300).json({ success: false, data, err: "An error occurred", form: req.body });
  }
}

export const get = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, err: 'An error occurred' });

  const data = await Model.findOne(
    { _id: req.params.id },
  );

  res.json(data);
}

export const remove = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, err: 'An error occurred' });

  const data = await Model.updateOne({
    _id: req.params.id,
  }, { $set: { active: false } });

  res.json(data);
}




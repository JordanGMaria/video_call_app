import Model from "../model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "PERSONCARE_SECRET_KEY";

export const login = async (req, res) => {
  const user = await Model.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ success: false, err: 'Email not found or invalid password', body: req.body });

  const canPass = await bcrypt.compare(req.body.password, user.password);
  if (!canPass) return res.status(400).json({ success: false, err: 'Email not found or invalid password', body: req.body });

  const beAToken = {
    _id: user._id,
    name: user.name,
    email: user.email
  };

  const token = jwt.sign(beAToken, SECRET, { expiresIn: '365d' });
  return res.json({ success: true, token: token, user: beAToken, session: req.session });
}


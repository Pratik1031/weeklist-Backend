const Users = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const signUp = async (req, res) => {
  const { fullName, email, password, age, gender, phone } = req.body;
  try {
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ message: 'User already Exists Please Log In ' });
      return res.redirect(307, '/login');
    }
    const hashpass = await bcrypt.hash(password, 10);
    const result = await Users.create({
      fullName: fullName,
      email: email,
      password: hashpass,
      age: age,
      gender: gender,
      phone: phone,
    });
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRECT_KEY
    );
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: 'USER NOT FOUND PLEASE SIGN UP' });
    }

    const matchPass = await bcrypt.compare(password, existingUser.password);
    if (!matchPass) {
      return res.status(403).json({ message: 'Invalid Password' });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRECT_KEY
    );
    res.status(200).send({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

module.exports = {
  signUp,
  login,
};

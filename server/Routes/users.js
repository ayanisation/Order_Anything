const express = require("express");
const UsersModel = require("../Models/usersModel");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const router = new express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await UsersModel.find();
    res.status(200).json(users);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to fetch users (Internal server error)" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const exists = await UsersModel.findOne({ phone: req.body.phone });
    if (exists) res.sendStatus(400);
    else {
      const newUser = new UsersModel(req.body);
      await newUser.save();
      const token = await sign(
        {
          _id: newUser._id,
          name: newUser.name,
          phone: newUser.phone,
          userType: newUser.userType,
        },
        process.env.SECRET_KEY
      );
      res.status(201).json({
        ...newUser,
        token: token,
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.log(e);
  }
});

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await UsersModel.findOne({ phone });
    if (!user || user?.userType !== req.body.userType) res.sendStatus(404);
    else {
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) res.sendStatus(400);
      else {
        const token = await sign(
          {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            userType: user.userType,
          },
          process.env.SECRET_KEY
        );
        res.status(200).json({
          ...user,
          token,
        });
      }
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to login (Internal server error)" });
  }
});

router.patch("/", async (req, res) => {
  const { _id } = req.body;
  try {
    const exists = await UsersModel.findOne({ _id });
    if (!exists) res.status(404).json({ message: "User doesn't exist" });
    else {
      const updated = await UsersModel.findByIdAndUpdate(
        _id,
        { ...req.body, _id },
        { new: true }
      );
      res.status(200).json(updated);
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to update (Internal server error)" });
  }
});

module.exports = router;

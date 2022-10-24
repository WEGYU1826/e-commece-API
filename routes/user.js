const router = require("express").Router();
const user = require("../models/user");
const CryptoJS = require("crypto-js");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//Update
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
  }
  try {
    const updateUser = await user.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...other } = updateUser._doc;
    res.status(201).json({ ...other });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get single User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const User = await user.findById(req.params.id);
    const { password, ...other } = User._doc;
    res.status(201).json({ other });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all User
router.get("/findAllUser", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const User = query
      ? await user.find().sort({ _id: 1 }).limit(5)
      : await user.find();
    res.status(201).json(User);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get User stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await user.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(201).json(data);
  } catch (error) {
    res.send(500).json(error);
  }
});

//delete
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id);
    res.status(201).json("User has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

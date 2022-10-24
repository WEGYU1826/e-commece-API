const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
 
// create
router.post("/create", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(201).json(updateCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get user cart
router.get("/find/:userID", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userID: req.params.userID });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All Cart
router.get("/getAllCart", verifyTokenAndAdmin, async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(201).json("Cart has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

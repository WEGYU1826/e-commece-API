const router = require("express").Router();
const Product = require("../models/product");
const CryptoJS = require("crypto-js");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const product = require("../models/product");

// create
router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(201).json(updateProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get single Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all User
router.get("/findAllProduct", async (req, res) => {
  const qNew = req.query.new;
  const qCatagories = req.query.catagories;
  try {
    let product;
    if (qNew) {
      product = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCatagories) {
      product = await Product.find({
        catagories: {
          $in: [qCatagories],
        },
      });
    } else {
      product = await Product.find();
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(201).json("Product has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

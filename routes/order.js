const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Order = require("../models/order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// create
router.post("/create", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(201).json(updateOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get user Orders
router.get("/find/:userID",verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userID: req.params.userID });
    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All orders
router.get("/getAllCart", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(201).json("Order has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Monthly Income
router.get('/income' , verifyTokenAndAdmin , async (req , res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await Order.aggregate([
            {$match: {
                createdAt: {$gte: prevMonth},
            }},
            {
                $project: {
                    month: { $month: $createdAt},
                    sales: '$amount',
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: '$sales'},
                }
            }
        ]);
        res.status(201).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;

const Order = require('../models/order');
const catchAsync = require('../utils/catchAsync');

exports.orders = catchAsync(
  async (req, res) => {
    let orders = await Order.find({})
      .sort('-createdAt')
      .populate('products.product');
    res.json(orders);
  },
  'from orders admin',
  400
);
exports.orderStatus = catchAsync(
  async (req, res) => {
    const { orderId, orderStatus } = req.body;

    let updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );
    res.json(updated);
  },
  'from orders status admin',
  400
);

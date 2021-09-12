const Coupon = require('../models/coupon');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(
  async (req, res) => {
    const { name, expiry, discount } = req.body.coupon;
    const coupon = await new Coupon({ name, expiry, discount }).save();

    res.json(coupon);
  },
  'From create coupon',
  400
);

exports.remove = catchAsync(
  async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.couponId);
    res.json(coupon);
  },
  'From remove coupon',
  400
);

exports.list = catchAsync(
  async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.json(coupons);
  },
  'From list coupon',
  400
);

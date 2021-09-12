const User = require('../models/user');
const Cart = require('../models/cart');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catchAsync');

exports.createPaymentIntent = catchAsync(
  async (req, res) => {
    const { couponApplied } = req.body;

    //user
    const user = await User.findOne({ email: req.user.email });

    //get user cart total
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderedBy: user._id,
    });

    let finalAmount =
      couponApplied && totalAfterDiscount
        ? totalAfterDiscount * 100
        : cartTotal * 100;

    //charge - create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    });
  },
  'From create payment intent',
  400
);

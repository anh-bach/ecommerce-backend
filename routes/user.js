const express = require('express');

const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  getOrders,
  addToWishlist,
  removeFromWislist,
  wishList,
  createCashOrder,
} = require('../controllers/user');
const { authCheck } = require('../middlewares/auth');

const router = express.Router();

//cart
router.post('/user/cart', authCheck, userCart);
router.get('/user/cart', authCheck, getUserCart);
router.delete('/user/cart', authCheck, emptyCart);

//address
router.post('/user/address', authCheck, saveAddress);

//order
router.post('/user/order', authCheck, createOrder); //stripe
router.post('/user/cash-order', authCheck, createCashOrder); //cash
router.get('/user/orders', authCheck, getOrders);

//wishlist
router.post('/user/wishlist', authCheck, addToWishlist);
router.get('/user/wishlist', authCheck, wishList);
router.put('/user/wishList/:productId', authCheck, removeFromWislist);

//coupon
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);

module.exports = router;

const express = require('express');

//controllers
const { createPaymentIntent } = require('../controllers/stripe');
//middlewares
const { authCheck } = require('../middlewares/auth');

const router = express.Router();

//routes
router.post('/create-payment-intent', authCheck, createPaymentIntent);

module.exports = router;

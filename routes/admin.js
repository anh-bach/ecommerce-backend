const express = require('express');

const { orders, orderStatus } = require('../controllers/admin');
const { authCheck, adminCheck } = require('../middlewares/auth');

const router = express.Router();

router.get('/admin/orders', authCheck, adminCheck, orders);
router.put('/admin/orders', authCheck, adminCheck, orderStatus);

module.exports = router;

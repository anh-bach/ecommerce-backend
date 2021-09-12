const admin = require('../firebase');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

//verify token from firebase
exports.authCheck = catchAsync(
  async (req, res, next) => {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    next();
  },
  'Error from authCheck',
  401,
  'Invalid or expired token'
);

//check admin role
exports.adminCheck = catchAsync(
  async (req, res, next) => {
    const { email } = req.user;

    const adminUser = await User.findOne({ email });
    if (adminUser.role !== 'admin') {
      res.status(403).json({ err: 'Admin resource. Access denied.' });
    } else {
      next();
    }
  },
  'Error from admin Check',
  401,
  'Server error'
);

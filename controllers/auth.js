const User = require('../models/user');

//1))create or update user
exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user; //coming from authCheck middlewares

  try {
    //if the user already exist, update it
    const user = await User.findOneAndUpdate(
      { email },
      { name: name || email.split('@')[0], picture },
      { new: true }
    );

    if (user) {
      res.json(user);
    } else {
      //if user not exist
      const newUser = await new User({
        email,
        name: name || email.split('@')[0],
        picture,
      }).save();
      res.json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'Server error' });
  }
};

//2)) get current logged in user
exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (user) res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'Server error' });
  }
};

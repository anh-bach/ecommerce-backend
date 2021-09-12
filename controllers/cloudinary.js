const cloudinary = require('cloudinary');

const catchAsync = require('../utils/catchAsync');

//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.upload = catchAsync(
  async (req, res) => {
    let result = await cloudinary.v2.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
    });
    res.json({ public_id: result.public_id, url: result.secure_url });
  },
  'from upload image',
  400
);
exports.remove = catchAsync(
  async (req, res) => {
    let image_id = req.body.public_id;
    cloudinary.v2.uploader.destroy(image_id, (error, result) => {
      if (error) return res.json({ success: false, err: error });
      res.send('ok');
    });
  },
  'from remove image',
  400
);

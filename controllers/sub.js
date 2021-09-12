const Sub = require('../models/sub');
const Product = require('../models/product');
const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(
  async (req, res) => {
    const { name, parent } = req.body;
    const sub = await new Sub({ name, slug: slugify(name), parent }).save();
    res.json(sub);
  },
  'from create subcategory',
  400,
  'Create sub category failed'
);

exports.read = catchAsync(
  async (req, res) => {
    const sub = await Sub.findOne({ slug: req.params.slug });
    const products = await Product.find({ subs: sub }).populate('category');
    if (!sub) throw Error('No such sub category found');
    res.json({ sub, products });
  },
  'Error from sub category read controller',
  400,
  'read sub category failed'
);

exports.list = catchAsync(
  async (req, res) => {
    const subs = await Sub.find({}).sort({ createdAt: -1 });
    res.json(subs);
  },
  'Error from sub category list controller',
  400,
  'read sub categories failed'
);

exports.remove = catchAsync(
  async (req, res) => {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) throw Error('No such sub category found');
    res.json(deleted);
  },
  'Error from sub category delete controller',
  400,
  'delete sub category failed'
);
exports.update = catchAsync(
  async (req, res) => {
    const { name, parent } = req.body;
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    if (!updated) throw Error('No such category found');
    res.json(updated);
  },
  'Error from sub category update controller',
  400,
  'update sub category failed'
);

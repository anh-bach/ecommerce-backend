const Category = require('../models/category');
const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');
const Subs = require('../models/sub');
const Product = require('../models/product');

exports.create = catchAsync(
  async (req, res) => {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  },
  'from create category',
  400,
  'Create category failed'
);

exports.read = catchAsync(
  async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category })
      .populate('category')
      .populate('postedBy', '_id name');

    if (!category) throw Error('No such category found');
    res.json({ category, products });
  },
  'Error from category read controller',
  400,
  'read category failed'
);

exports.list = catchAsync(
  async (req, res) => {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  },
  'Error from category list controller',
  400,
  'read category failed'
);

exports.remove = catchAsync(
  async (req, res) => {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) throw Error('No such category found');
    res.json(deleted);
  },
  'Error from category delete controller',
  400,
  'delete category failed'
);
exports.update = catchAsync(
  async (req, res) => {
    const { name } = req.body;
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    if (!updated) throw Error('No such category found');
    res.json(updated);
  },
  'Error from category update controller',
  400,
  'update category failed'
);

exports.getSubs = catchAsync(
  async (req, res) => {
    const subs = await Subs.find({ parent: req.params._id });

    res.json(subs);
  },
  'Error from category get subs controller',
  400,
  'get sub category failed'
);

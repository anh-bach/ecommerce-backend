const slugify = require('slugify');

const Product = require('../models/product');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(
  async (req, res) => {
    req.body.slug = slugify(req.body.title);

    const product = await new Product(req.body).save();
    res.json(product);
  },
  'from create product',
  400
);

exports.listAll = catchAsync(
  async (req, res) => {
    const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .sort([['createdAt', 'desc']]);
    res.json(products);
  },
  'from create product',
  400
);

exports.remove = catchAsync(
  async (req, res) => {
    const deleted = await Product.findOneAndRemove({ slug: req.params.slug });
    res.json(deleted);
  },
  'from remove product',
  400
);

exports.read = catchAsync(
  async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name');

    res.json(product);
  },
  'from read single product',
  400
);

exports.update = catchAsync(
  async (req, res) => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );

    res.json(product);
  },
  'from update product',
  400
);

exports.list = catchAsync(
  async (req, res) => {
    //createdAt/updatedAt, desc/asc, limit
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .sort([[sort, order]])
      .limit(perPage);

    res.json(products);
  },
  'from list product',
  400
);

exports.productsCount = catchAsync(
  async (req, res) => {
    const total = await Product.estimatedDocumentCount({});

    res.json(total);
  },
  'from list product',
  400
);

exports.productStar = catchAsync(
  async (req, res) => {
    const product = await Product.findById(req.params.productId);
    const user = await User.findOne({ email: req.user.email });
    const { star } = req.body;

    //who is updating
    //check if user has already rated
    let existingRatingObj = product.ratings.find(
      (el) => el.postedBy.toString() === user._id.toString()
    );
    //if´user hasnot rated yet
    if (!existingRatingObj) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      );
      res.json({ ratingAdded });
    } else {
      //if user already left rating, updating it

      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObj },
        },
        { $set: { 'ratings.$.star': star } },
        { new: true }
      );
      res.json(ratingUpdated);
    }
  },
  'from product star',
  400
);

exports.listRelated = catchAsync(
  async (req, res) => {
    const product = await Product.findById(req.params.productId);
    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name');

    res.json(related);
  },
  'from list related products',
  400
);

//helper functions to hanlde query
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  console.log('handle query--->');
  res.json(products);
};

//helper functions to hanlde price
const handlePrice = async (req, res, price) => {
  const products = await Product.find({
    price: { $gte: price[0], $lte: price[1] },
  })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  console.log('handle price--->');
  res.json(products);
};

//helper functions to hanlde category
const handleCategory = async (req, res, category) => {
  const products = await Product.find({ category })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  console.log('handle category--->');
  res.json(products);
};

//helper functions to hanlde stars
const handleStars = async (req, res, stars) => {
  console.log('handle stars--->');
  const aggregates = await Product.aggregate([
    {
      $project: {
        document: '$$ROOT' /**get all existing fields from Product */,
        floorAverage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ]).limit(12);

  const products = await Product.find({ _id: aggregates })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  res.json(products);
};

//helper functions to hanlde sub category
const handleSubs = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  console.log('handle sub--->');
  res.json(products);
};

//helper functions to hanlde shipping
const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  console.log('handle shipping--->');
  res.json(products);
};

//helper functions to hanlde brand
const handleBrands = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  console.log('handle brand--->', brand);
  res.json(products);
};

//helper functions to hanlde Color
const handleColors = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');
  console.log('handle color--->');
  res.json(products);
};

exports.searchFilter = catchAsync(
  async (req, res) => {
    const { query, price, category, stars, sub, brand, shipping, color } =
      req.body;
    //search query
    if (query) {
      await handleQuery(req, res, query);
    }

    //price
    if (price) {
      await handlePrice(req, res, price);
    }

    //category
    if (category) {
      await handleCategory(req, res, category);
    }

    //stars
    if (stars) {
      await handleStars(req, res, stars);
    }

    //sub
    if (sub) {
      await handleSubs(req, res, sub);
    }

    //sub
    if (shipping) {
      await handleShipping(req, res, shipping);
    }

    //brand
    if (brand) {
      await handleBrands(req, res, brand);
    }

    //color
    if (color) {
      await handleColors(req, res, color);
    }
  },
  'from list search filter products',
  400
);

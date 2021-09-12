const express = require('express');

//controllers
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilter,
} = require('../controllers/product');
//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

const router = express.Router();

//routes
router.post('/product', authCheck, adminCheck, create); //using AdminRoute instead - but we can use adminCheck if we do request from Postman
router.post('/products', list);
router.post('/search/filters', searchFilter);

router.put('/product/:slug', authCheck, adminCheck, update);
router.put('/product/star/:productId', authCheck, productStar);

router.get('/products/total', productsCount);
router.get('/products/:count', listAll);
router.get('/product/:slug', read);
router.get('/product/related/:productId', listRelated);

router.delete('/product/:slug', authCheck, adminCheck, remove);

module.exports = router;

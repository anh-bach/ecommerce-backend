const express = require('express');

//controllers
const {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} = require('../controllers/category');
//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

const router = express.Router();

router.post('/category', authCheck, adminCheck, create); //using AdminRoute instead - but we can use adminCheck if we do request from Postman
router.get('/category/:slug', read);
router.get('/categories', list);
router.get('/category/subs/:_id', getSubs);
router.put('/category/:slug', authCheck, adminCheck, update); //using AdminRoute instead
router.delete('/category/:slug', authCheck, adminCheck, remove); //using AdminRoute instead

module.exports = router;

const express = require('express');

//controllers
const { create, read, update, remove, list } = require('../controllers/sub');
//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

const router = express.Router();

router.post('/sub', authCheck, adminCheck, create); //using AdminRoute instead - but we can use adminCheck if we do request from Postman
router.get('/sub/:slug', read);
router.get('/subs', list);
router.put('/sub/:slug', authCheck, adminCheck, update); //using AdminRoute instead
router.delete('/sub/:slug', authCheck, adminCheck, remove); //using AdminRoute instead

module.exports = router;

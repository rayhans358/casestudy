const router = require('express').Router();
const productRoute = require ('./productRouter');
const categoryRoute = require('./categoryRouter');
const tagRoute = require ('./tagRouter');

router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/tags', tagRoute);

module.exports = router;
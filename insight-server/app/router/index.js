const router = require('express').Router();
const productRoute = require('./product');
const categoryRoute = require('./category');
const tagRoute = require('./tag');
const authRoute = require('./auth');
const deliveryAddressRoute = require('./deliveryAddress');

router.use('/auth', authRoute);
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/tags', tagRoute);
router.use('/delivery-address', deliveryAddressRoute);

module.exports = router;
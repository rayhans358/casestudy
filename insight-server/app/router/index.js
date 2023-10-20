const router = require('express').Router();
const productRoute = require('./product');
const categoryRoute = require('./category');
const tagRoute = require('./tag');
const authRoute = require('./auth');
const deliveryAddressRoute = require('./deliveryAddress');
const cartRoute = require('./cart');

router.use('/auth', authRoute);
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/tags', tagRoute);
router.use('/delivery-address', deliveryAddressRoute);
router.use('/carts', cartRoute);

module.exports = router;
const router = require('express').Router();
const productRoute = require('./product');
const categoryRoute = require('./category');
const tagRoute = require('./tag');
const authRoute = require('./auth');
const deliveryAddressRoute = require('./deliveryAddress');
const cartRoute = require('./cart');
const orderRoute = require('./order');
const invoiceRoute = require('./invoice');
const regionRoute = require('./region');
const bankRoute = require('./bank');

router.use('/auth', authRoute);
router.use('/categories', categoryRoute);
router.use('/carts', cartRoute);
router.use('/delivery-address', deliveryAddressRoute);
router.use('/invoices', invoiceRoute);
router.use('/banks', bankRoute);
router.use('/orders', orderRoute);
router.use('/products', productRoute);
router.use('/regions', regionRoute);
router.use('/tags', tagRoute);

module.exports = router;
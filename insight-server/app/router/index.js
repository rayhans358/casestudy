const router = require('express').Router();
const productRoute = require ('./productRouter');
const categoryRoute = require('./categoryRouter');
const tagRoute = require ('./tagRouter');

router.use('/api', productRoute);
router.use('/api', categoryRoute);
router.use('/api', tagRoute);

module.exports = router;
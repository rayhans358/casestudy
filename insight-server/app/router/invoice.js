const router = require('express').Router();
const invoiceController = require('../controller/invoice');

router.get('/:order_id', invoiceController.getInvoice);

module.exports = router;
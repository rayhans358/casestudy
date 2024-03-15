const router = require('express').Router();
const orderController = require('../controller/order');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get(
  '/',
  checkAuthorization('read', 'Order'),
  orderController.getOrder
);

router.post(
  '/',
  checkAuthorization('create', 'Order'),
  orderController.postOrder
);

module.exports = router;
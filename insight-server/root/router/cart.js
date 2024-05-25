const router = require('express').Router();
const cartController = require('../controller/cart');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get(
  '/',
  checkAuthorization('read', 'Cart'),
  cartController.getCart
);

router.put(
  '/',
  checkAuthorization('update', 'Cart'),
  cartController.putUpdateCart
);

module.exports = router;
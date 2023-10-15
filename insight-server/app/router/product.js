const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const productController = require('../controller/product');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get('/', productController.getProducts);
router.post('/', 
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('create', 'Product'),
  productController.postProducts
);
router.put('/:id', 
  multer({dest: os.tmpdir()}).single('image'), 
  checkAuthorization('update', 'Product'),
  productController.putUpdateProducts
);
router.delete('/:id',
  checkAuthorization('update', 'Product'),
  productController.deleteProductByid
);

module.exports = router;
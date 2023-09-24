const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const productController = require('../controller/productController');

router.get('/', productController.getProducts);
router.post('/', multer({dest: os.tmpdir()}).single('image'), productController.postProducts);
router.put('/:id', multer({dest: os.tmpdir()}).single('image'), productController.putUpdateProducts);
router.delete('/:id', productController.deleteProductByid);

module.exports = router;
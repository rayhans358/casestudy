const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const productController = require('./controller');

router.get('/products', productController.getProducts);
router.post('/products', multer({dest: os.tmpdir()}).single('image'), productController.postProducts);
router.put('/products/:id', multer({dest: os.tmpdir()}).single('image'), productController.putUpdateProducts);
router.delete('/products/:id', productController.deleteProductByid);

module.exports = router;
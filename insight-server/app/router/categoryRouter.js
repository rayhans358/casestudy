const router = require('express').Router();
const categoryController = require('../controller/categoryController');

router.get('/categories', categoryController.getCategory);
router.post('/categories', categoryController.postCategory);
router.put('/categories/:id', categoryController.putUpdateCategory);
router.delete('/categories/:id', categoryController.deleteCategoryByid);

module.exports = router;
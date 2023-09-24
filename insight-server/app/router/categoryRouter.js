const router = require('express').Router();
const categoryController = require('../controller/categoryController');

router.get('/', categoryController.getCategory);
router.post('/', categoryController.postCategory);
router.put('/:id', categoryController.putUpdateCategory);
router.delete('/:id', categoryController.deleteCategoryByid);

module.exports = router;
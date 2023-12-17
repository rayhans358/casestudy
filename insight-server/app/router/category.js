const router = require('express').Router();
const categoryController = require('../controller/category');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get('/', 
  checkAuthorization('read', 'Category'),
  categoryController.getCategory
);
router.post('/',
  checkAuthorization('create', 'Category'),
  categoryController.postCategory
);
router.put('/:id',
  checkAuthorization('update', 'Category'),
  categoryController.putUpdateCategory
);
router.delete('/:id',
  checkAuthorization('delete', 'Category'),
  categoryController.deleteCategoryByid
);

module.exports = router;
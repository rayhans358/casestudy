const router = require('express').Router();
const categoryController = require('../controller/category');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get('/',
  categoryController.getCategory
);

router.get('/:id',
  categoryController.getCategoryById
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
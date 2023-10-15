const router = require('express').Router();
const tagController = require('../controller/tag');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get('/', tagController.getTag);
router.post('/', 
  checkAuthorization('create', 'Tag'),
  tagController.postTag
);
router.put('/:id', 
  checkAuthorization('update', 'Tag'),
  tagController.putUpdateTag
);
router.delete('/:id', 
  checkAuthorization('delete', 'Tag'),
  tagController.deleteTagByid
);

module.exports = router;
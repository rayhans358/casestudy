const router = require('express').Router();
const tagController = require('../controller/tagController');

router.get('/', tagController.getTag);
router.post('/', tagController.postTag);
router.put('/:id', tagController.putUpdateTag);
router.delete('/:id', tagController.deleteTagByid);

module.exports = router;
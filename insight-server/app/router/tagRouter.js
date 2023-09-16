const router = require('express').Router();
const tagController = require('../controller/tagController');

router.get('/tags', tagController.getTag);
router.post('/tags', tagController.postTag);
router.put('/tags/:id', tagController.putUpdateTag);
router.delete('/tags/:id', tagController.deleteTagByid);

module.exports = router;
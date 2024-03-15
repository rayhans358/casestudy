const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const miniMarketController = require('../controller/miniMarket');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get('/',
  miniMarketController.getAllMiniMarkets
);

router.post('/',
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('create', 'Bank'),
  miniMarketController.postNameMiniMarkets
);

router.put('/:id',
  multer({dest: os.tmpdir()}).single('image'), 
  checkAuthorization('update', 'Bank'),
  miniMarketController.putUpdateMiniMarkets
);

router.delete('/:id',
  checkAuthorization('delete', 'Bank'),
  miniMarketController.deleteMiniMarketById
);

module.exports = router;
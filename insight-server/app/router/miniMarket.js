const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const miniMarketController = require('../controller/miniMarket');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get('/',
  miniMarketController.getAllMiniMarkets
);

router.get('/:id',
  miniMarketController.getMiniMarketById
);

router.post('/',
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('create', 'MiniMarket'),
  miniMarketController.postNameMiniMarkets
);

router.put('/:id',
  multer({dest: os.tmpdir()}).single('image'), 
  checkAuthorization('update', 'MiniMarket'),
  miniMarketController.putUpdateMiniMarkets
);

router.delete('/:id',
  checkAuthorization('delete', 'MiniMarket'),
  miniMarketController.deleteMiniMarketsById
);

module.exports = router;
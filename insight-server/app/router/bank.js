const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const bankController = require('../controller/bank');
const { checkAuthorization } = require('../middleware/authorizationMiddleware');

router.get('/',
  bankController.getAllBanks
);

router.get('/:id',
  bankController.getBankById
);

router.post('/',
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('create', 'Bank'),
  bankController.postNameBanks
);

router.put('/:id',
  multer({dest: os.tmpdir()}).single('image'), 
  checkAuthorization('update', 'Bank'),
  bankController.putUpdateBanks
);

router.delete('/:id',
  checkAuthorization('delete', 'Bank'),
  bankController.deleteBanksById
);

module.exports = router;
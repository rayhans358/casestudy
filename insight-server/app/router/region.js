const router = require('express').Router();
const regionController = require('../controller/region');

router.get('/provinces', regionController.getProvince);
router.get('/regences', regionController.getRegency);
router.get('/districts', regionController.getDistrict);
router.get('/villages', regionController.getVillage);

module.exports = router;
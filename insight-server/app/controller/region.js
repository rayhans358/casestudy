const { provinsi, kabupaten, kecamatan, desa } = require("daftar-wilayah-indonesia");

const getProvince = async (req, res, next) => {
  try {
    return res.status(200).json({
      data: provinsi()
    });

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);
  };
};

const getRegency = async (req, res, next) => {
  const { code } = req.query;

  try {
    return res.status(200).json({
      data: kabupaten(code)
    });

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);
  };
};

const getDistrict = async (req, res, next) => {
  const { code } = req.query;

  try {
    return res.status(200).json({
      data: kecamatan(code)
    });

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);
  };
};

const getVillage = async (req, res, next) => {
  const { code } = req.query;

  try {
    return res.status(200).json({
      data: desa(code)
    });

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);
  };
};

module.exports = {
  getProvince,
  getRegency,
  getDistrict,
  getVillage
}
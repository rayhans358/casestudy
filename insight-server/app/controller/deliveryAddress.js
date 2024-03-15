const { subject } = require("@casl/ability");
const DeliveryAddress = require("../model/deliveryAddressModel");
const { policyFor } = require("../../utils/policies");
const { provinsi, kabupaten, kecamatan, desa } = require("daftar-wilayah-indonesia");

const getDeliveryAddress = async (req, res, next) => {
  try {
    let address = await DeliveryAddress.find();
    const map = {};
    const prov = provinsi();
    const kab = kabupaten();
    const kec = kecamatan();
    const ds = desa();
    prov.forEach(value => {
      map[value.kode] = value.nama
    });
    kab.forEach(value => {
      map[value.kode] = value.nama
    });
    kec.forEach(value => {
      map[value.kode] = value.nama
    });
    ds.forEach(value => {
      map[value.kode] = value.nama
    });
    address.forEach(value => {
      value.provinsi = map[value.provinsi]
      value.kabupaten = map[value.kabupaten]
      value.kecamatan = map[value.kecamatan]
      value.kelurahan = map[value.kelurahan]
    });
    res.status(200).json(address);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  };
};

const getDeliveryAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let address = await DeliveryAddress.findById(id);

    if (!address) {
      return res.status(404).json({
        error: 1,
        message: 'Delivery address not found'
      });
    };

    const map = {};
    const prov = provinsi();
    const kab = kabupaten();
    const kec = kecamatan();
    const ds = desa();
    prov.forEach(value => {
      map[value.kode] = value.nama
    });
    kab.forEach(value => {
      map[value.kode] = value.nama
    });
    kec.forEach(value => {
      map[value.kode] = value.nama
    });
    ds.forEach(value => {
      map[value.kode] = value.nama
    });
    address.provinsi = map[address.provinsi];
    address.kabupaten = map[address.kabupaten];
    address.kecamatan = map[address.kecamatan];
    address.kelurahan = map[address.kelurahan];
    res.status(200).json(address);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  };
};

const postDeliveryAddress = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddress({
      ...payload, 
      user: user._id
    });
    await address.save();
    return res.status(201).json(address);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);
  };
};

const putUpdateDeliveryAddress = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let subjectAddress = subject('DeliveryAddress', {
      ...address, 
      user_id: address.user
    });
    let policy = policyFor(req.user);

    if (!policy.can('update', subjectAddress)) {
      return res.status(400).json({
        error: 1,
        message: `You're not allowed to modify this resource`
      });
    };

    address = await DeliveryAddress
      .findByIdAndUpdate(
        id, 
        payload, 
        { new: true }
      );
    return res.status(200).json(address);

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

const deleteDeliveryAddressById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let subjectAddress = subject('DeliveryAddress', {
      ...address, 
      user_id: address.user
    });
    let policy = policyFor(req.user);

    if (!policy.can('delete', subjectAddress)) {
      return res.status(400).json({
        error: 1,
        message: `You're not allowed to modify this resource`
      });
    };

    address = await DeliveryAddress.findByIdAndDelete(id);

    return res.status(200).json({
      error: 0,
      message: 'DeliveryAddress deleted successfully',
    });

  } catch (err) {
    next(err);
  };
};

module.exports = {
  getDeliveryAddress,
  getDeliveryAddressById,
  postDeliveryAddress,
  putUpdateDeliveryAddress,
  deleteDeliveryAddressById
}
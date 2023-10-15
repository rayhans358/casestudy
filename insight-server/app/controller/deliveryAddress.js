const DeliveryAddress = require("../model/deliveryAddress");

const getDeliveryAddress = async (req, res, next) => {
  try {
    let address = await DeliveryAddress.find();
    res.json(address);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const postDeliveryAddress = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddress({...payload, user: user._id});
    await address.save();
    return res.json(address);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json ({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
}

const putUpdateDeliveryAddress = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;
    // let user = req.user;
    let address = await DeliveryAddress.findById(id);

    address = await DeliveryAddress.findByIdAndUpdate(id, payload, { new: true }
    );
    return res.json(address);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
}

const deleteDeliveryAddressById = async (req, res, next) => {
  try {
    let { id } = req.params;
    await DeliveryAddress.findByIdAndDelete(id);

    return res.status(200).json({
      error: 0,
      message: 'DeliveryAddress deleted successfully',
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDeliveryAddress,
  postDeliveryAddress,
  putUpdateDeliveryAddress,
  deleteDeliveryAddressById
}
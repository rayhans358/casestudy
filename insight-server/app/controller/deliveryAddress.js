const { policyFor } = require("../../utils/policies");
const DeliveryAddress = require("../model/deliveryAddress");

const getDeliveryAddress = async (req, res, next) => {
  try {
    let addresses = await DeliveryAddress.find({});
    res.json(addresses);

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
    let { id } = req.params;
    const payload = req.body;
    let address = await DeliveryAddress.findById(id);
    const policy = policyFor(req.user);

    if (!policy.can('update', 'DeliveryAddress')) {
      return res.json({
        error: 1,
        message: 'You are not allowed to update DeliveryAddress'
      });
    }

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

module.exports = {
  getDeliveryAddress,
  postDeliveryAddress,
  putUpdateDeliveryAddress
}
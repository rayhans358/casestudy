const { Types } = require("mongoose");
const CartItem = require("../model/cartItemModel");
const DeliveryAddress = require("../model/deliveryAddressModel");
const Order = require("../model/orderModel");
const OrderItem = require("../model/orderItemModel");

const postOrder = async(req, res, next) => {
  try {
    let {delivery_fee, delivery_address} = req.body;
    let items = await CartItem.find({user: req.user._id}).populate('product');
    if (!items) {
      return res.status(400).json({
        error: 1,
        message: `You're not create order because you have not items in cart`
      });
    };
    let address = await DeliveryAddress.findById(delivery_address);
    let order = new Order({
      _id: new Types.ObjectId(),
      status: 'waiting_payment',
      delivery_fee: delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail
      },
      user: req.user._id
    });
    let orderItems = 
      await OrderItem
      .insertMany(items.map(item => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id
      })));
    orderItems.forEach(item => order.order_items.push(item));
    order.save();
    await CartItem.deleteMany({user: req.user._id});
    return res.status(201).json(order);
    
  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);
  };
};

const getOrder = async(req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let user = {user: req.user._id}
    let count = await Order.find(user).countDocuments();
    let orders = 
      await Order
      .find(user)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('order_items')
      .sort('-createdAt');
    return res.status(200).json({
      data: orders.map(order => order.toJSON({virtuals: true})),
      count
    });

  } catch (err) {
    if (err & err.name === 'ValidationError') {
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
  postOrder,
  getOrder
}
const { Types } = require("mongoose");
const CartItem = require("../model/cartItemModel");
const DeliveryAddress = require("../model/deliveryAddressModel");
const Order = require("../model/orderModel");
const OrderItem = require("../model/orderItemModel");

const postOrder = async(req, res, next) => {
  try {
    let {delivery_fee, delivery_address, delivery_courier} = req.body;
    let items = await CartItem
      .find({user: req.user._id})
      .populate('product')
    console.log(items, 'items');

    if (!items || items.length === 0) {
      return res.status(400).json({
        error: 1,
        message: `Anda belum membuat pesanan karena tidak ada item dalam keranjang`
      });
    };

    let address = await DeliveryAddress.findById(delivery_address);

    if (!address) {
      return res.status(400).json({
        error: 1,
        message: `Invalid delivery address`
      });
    };

    let user = req.user._id
    let order = new Order({
      user: user,
      _id: new Types.ObjectId(),
      status: 'waiting_payment',
      delivery_courier: delivery_courier,
      delivery_fee: delivery_fee,
      delivery_address: {
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        fullStreet: address.fullStreet,
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kabupaten: address.kabupaten,
        provinsi: address.provinsi
      }
    });
    let orderItems = await OrderItem
        .insertMany(items.map(item => ({
          ...item.toObject(),
          order: order._id,
          cartName: item.product.name,
          unit_price: parseInt(item.product.price),
          qty: parseInt(item.qty),
          product: item.product._id
        })));

    orderItems.forEach(item => order.order_items.push(item._id))
    await order.save();
    console.log(order, 'order');
    console.log(orderItems, 'orderItems');
    await CartItem.deleteMany({user: req.user._id});
    return res.status(201).json(order);
    
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      console.log(err, 'err');
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
    console.log(user);
    console.log(req.user._id);
    let count = await Order.find(user).countDocuments();
    console.log(count, 'CN');
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
  postOrder,
  getOrder
}
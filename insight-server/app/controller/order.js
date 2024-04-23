const { Types } = require("mongoose");
const DeliveryAddress = require("../model/deliveryAddressModel");
const CartItem = require("../model/cartItemModel");
const Order = require("../model/orderModel");
const OrderItem = require("../model/orderItemModel");

const postOrder = async(req, res, next) => {
  const { 
    delivery_courier, 
    delivery_fee, 
    delivery_address, 
    order_items,
    paymentMethod 
  } = req.body;

  try {
    let address = await DeliveryAddress.findById(delivery_address);

    if (!address) {
      return res.status(400).json({
        error: 1,
        message: `Invalid delivery address`
      });
    };

    let user = req.user._id
    let totalQty = 0;
    let subTotal = 0;
    let totalShopping = 0;
    
    for (let item of order_items) {
      subTotal += parseInt(item.price) * parseInt(item.qty);
    }
    totalQty = order_items.reduce((total, item) => total + parseInt(item.qty), 0);
    totalShopping += subTotal + parseInt(delivery_fee);

    let order = new Order({
      user: user,
      _id: new Types.ObjectId(),
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
      },
      totalQty: totalQty,
      subTotal: subTotal,
      totalShopping: totalShopping,
      paymentMethod: paymentMethod.name,
      status: 'waiting_payment',
    });
    
    let orderItems = await OrderItem
        .insertMany(order_items.map(item => ({
          order: order._id,
          name: item.name,
          price: parseInt(item.price),
          qty: parseInt(item.qty),
          product: item.product
        })));

    orderItems.forEach(item => order.order_items.push(item))
    await order.save();
    await CartItem.deleteMany({user: req.user._id});
    return res.status(201).json(order);
    
  } catch (err) {
    console.log(err, 'err');
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

const getOrder = async(req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId, 'userId');
    let count = await Order
      .find({ user: userId })
      .countDocuments();
    console.log(count, 'CN');
    let orders = 
      await Order
        .find({ user: userId })
        .populate('order_items')
        .sort('createdAt');
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
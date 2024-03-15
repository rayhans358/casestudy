const mongoose = require('mongoose');
const Invoice = require('./invoiceModel');
const { model, Schema } = mongoose;

const orderSchema = Schema({
  status: {
    type: String,
    enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
    default: 'waiting_payment'
  },

  delivery_courier: {
    type: String
  },

  delivery_fee: {
    type: Number,
    default: 0
  },

  delivery_address: {
    provinsi: { 
      type: String
    },

    kabupaten: { 
      type: String
    },

    kecamatan: { 
      type: String
    },

    kelurahan: { 
      type: String
    },

    fullStreet: {
      type: String
    },

    fullName: {
      type: String
    },
  
    phoneNumber: {
      type: String
    },
  },

  paymentMethod: {
    type: String
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  order_items: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderItem'
  }],

  order_number: {
    type: Number
  }

}, {timestamps: true});

// orderSchema.plugin(AutoIncrement, {inc_field: 'order_number'});

orderSchema.pre('save', async function(next) {
  if (!this.order_number && this.order_number !== 0) {
    const highestOrder = await this.constructor.findOne({}, {}, { sort: { order_number: -1 } });
    if (highestOrder && highestOrder.order_number !== null) {
      this.order_number = highestOrder.order_number + 1;
    } else {
      this.order_number = 1;
    }
  }
  next();
});

orderSchema.virtual('totalQty').get(function() {
  return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0)
});

orderSchema.post('save', async function() {
  // const totalQty = this.order_items.reduce((total, item) => total + item.qty, 0);
  // const totalPrice = this.order_items.reduce((total, item) => total += (item.price * item.qty), 0);
  await this.populate('order_items').execPopulate();
  const totalPrice = this.order_items.reduce((total, item) => total += (item.price * item.qty), 0);
  let invoice = new Invoice({
    user: this.user,
    delivery_courier: this.delivery_courier,
    delivery_fee: parseInt(this.delivery_fee),
    delivery_address: {
      fullName: this.delivery_address.fullName,
      phoneNumber: this.delivery_address.phoneNumber,
      fullStreet: this.delivery_address.fullStreet,
      kelurahan: this.delivery_address.kelurahan,
      kecamatan: this.delivery_address.kecamatan,
      kabupaten: this.delivery_address.kabupaten,
      provinsi: this.delivery_address.provinsi
    },
    order: this._id, //orderItems
    cartName: this.order_items.cartName.map(item => item.cartName), //orderItems
    unit_price: this.order_items.map(item => item.price), //orderItems
    qty: this.order_items.map(item => item.qty).length, //orderItems
    total_qty: this.totalQty, //orderItems
    totalPrice: totalPrice, //orderItems
    totalShopping: parseInt(totalPrice + this.delivery_fee), //orderItems
    paymentMethod: this.paymentMethod //orderItems
  });
  console.log(invoice, 'invoice');
  console.log(invoice.fullName, 'invoice fullName');
  console.log(invoice.phoneNumber, 'invoice phoneNumber');
  console.log(invoice.delivery_courier, 'invoice delivery_courier');
  console.log(invoice.cartName, 'invoice cartName');
  await invoice.save();
});

const Order = model('Order', orderSchema);

module.exports = Order;
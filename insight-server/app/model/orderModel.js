const mongoose = require('mongoose');
const Invoice = require('./invoiceModel');
const { model, Schema } = mongoose;

const orderSchema = Schema({
  status: {
    type: String,
    enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
    default: 'waiting_payment'
  },
  delivery_fee: {
    type: Number,
    default: 0
  },
  delivery_address: {
    provinsi: { type: String, required: [true, 'Field provinsi tidak boleh kosong'] },
    kabupaten: { type: String, required: [true, 'Field kabupaten tidak boleh kosong'] },
    kecamatan: { type: String, required: [true, 'Field kecamatan tidak boleh kosong'] },
    kelurahan: { type: String, required: [true, 'Field kelurahan tidak boleh kosong'] },
    detail: {type: String}
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
      this.order_number = '1';
    }
  }
  next();
});

orderSchema.virtual('items_count').get(function() {
  return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0)
});
orderSchema.post('save', async function() {
  let sub_total = this.order_items.reduce((total, item) => total += (item.price * item.qty), 0);
  let invoice = new Invoice({
    user: this.user,
    oder: this._id,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address
  });
  await invoice.save();
});

const Order = model('Order', orderSchema);

module.exports = Order;
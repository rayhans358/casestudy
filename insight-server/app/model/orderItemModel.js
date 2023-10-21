const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    required: [true, 'Field name tidak boleh kosong'],
    minlength: [5, 'Field name minimal 5 karakter']
  },
  price: {
    type: Number,
    required: [true, 'Field harga item tidak boleh kosong']
  },
  qty: {
    type: Number,
    required: [true, 'Field qty tidak boleh kosong'],
    min: [1, 'Kuantitas minimal 1']
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
});

const OrderItem = model('OrderItem', orderItemSchema);

module.exports = OrderItem;
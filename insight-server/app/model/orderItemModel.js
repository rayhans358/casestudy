const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    minlength: [5, 'Field name minimal 5 karakter'],
    required: [true, 'Name item tidak boleh kosong']
  },

  price: {
    type: Number,
    required: [true, 'Harga item tidak boleh kosong']
  },

  qty: {
    type: Number,
    min: [1, 'Kuantitas minimal 1'],
    required: [true, 'Qty tidak boleh kosong']
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product tidak boleh kosong']
  },
  
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order tidak boleh kosong']
  }
});

const OrderItem = model('OrderItem', orderItemSchema);

module.exports = OrderItem;
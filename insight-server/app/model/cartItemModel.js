const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
  name: {
    type: String,
    required: [true, 'Field name tidak boleh kosong'],
    minlength: [5, 'Field name minimal 5 karakter']
  },
  qty: {
    type: Number,
    required: [true, 'Field qty tidak boleh kosong'],
    min: [1, 'Kuantitas minimal 1']
  },
  price: {
    type: Number,
    default: 0
  },
  image_url: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
});

const CartItem = model('CartItem', cartItemSchema);

module.exports = CartItem;
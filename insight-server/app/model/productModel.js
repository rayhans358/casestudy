const mongoose = require('mongoose');
const { model, Schema} = mongoose;

const productSchema = Schema({
  name: {
    type: String,
    minlength: [3, 'Minimal 3 karakter'],
    required: [true, 'Field name tidak boleh kosong']
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    maxlength: [1000, 'Maksimal 1000 karakter']
  },
  image_url: {
    type: String
  }
}, {timestamps: true});

const Product = model('Product', productSchema);

module.exports = Product;
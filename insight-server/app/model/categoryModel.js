const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: {
    type: String,
    minlength: [3, 'Field category minimal 3 karakter'],
    maxlength: [20, 'Field category maksimal 20 karakter'],
    required: [true, 'Field category tidak boleh kosong']
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
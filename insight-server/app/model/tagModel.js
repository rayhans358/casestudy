const mongoose = require ('mongoose');
const { model, Schema} = mongoose;

const tagSchema = Schema({
  name: {
    type: String,
    required: [true, 'Field tag tidak boleh kosong'],
    minlength: [3, 'Field tag minimal 3 karakter'],
    maxlength: [20, 'Field tag maksimal 20 karakter'],
  }
});

const Tag = model('Tag', tagSchema);

module.exports = Tag;
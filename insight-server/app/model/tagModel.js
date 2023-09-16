const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const tagSchema = Schema ({
  name: {
    type: String,
    minlength: [3, 'Field tag minimal 3 karakter'],
    maxlength: [20, 'Field tag maksimal 20 karakter'],
    required: [true, 'Field tag tidak boleh kosong']
  }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
const mongoose = require('mongoose');
const { model, Schema} = mongoose;

const bankSchema = Schema ({
  name: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  }
});

const Bank = model('Bank', bankSchema);

module.exports = Bank;
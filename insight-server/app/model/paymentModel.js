const mongoose = require('mongoose');
const { model, Schema} = mongoose;

const paymentSchema = Schema({
  type: {
    type: String,
    enum: ['Bank', 'MiniMarket'],
    required: true
  },

  name: {
    type: String,
    required: true
  },

  image_url: {
    type: String
  },

  info: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const invoiceSchema = Schema({
  totalPrice: {
    type: Number,
    required: [true, 'Field total_price tidak boleh kosong']
  },

  delivery_fee: {
    type: Number,
    default: 0
  },

  delivery_courier: {
    type: String
  },

  delivery_address: {
    provinsi: { type: String },
    kabupaten: { type: String },
    kecamatan: { type: String },
    kelurahan: { type: String },
    fullStreet: { type: String }
  },

  totalShopping: {
    type: Number,
    required: [true, 'Field total tidak boleh kosong']
  },

  payment_status: {
    type: String,
    enum: ['waiting_payment', 'paid'],
    default: 'waiting_payment'
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  order: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {timestamps: true});

const Invoice = model('Invoice', invoiceSchema);

module.exports = Invoice;
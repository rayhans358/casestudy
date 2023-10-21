const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const invoiceSchema = Schema({
  sub_total: {
    type: Number,
    required: [true, 'Field sub_total tidak boleh kosong']
  },
  delivery_fee: {
    type: Number,
    required: [true, 'Field delivery_fee tidak boleh kosong']
  },
  delivery_address: {
    provinsi: { type: String, required: [true, 'Field provinsi tidak boleh kosong'] },
    kabupaten: { type: String, required: [true, 'Field kabupaten tidak boleh kosong'] },
    kecamatan: { type: String, required: [true, 'Field kecamatan tidak boleh kosong'] },
    kelurahan: { type: String, required: [true, 'Field kelurahan tidak boleh kosong'] },
    detail: {type: String}
  },
  total: {
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
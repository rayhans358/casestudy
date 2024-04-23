const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const invoiceSchema = Schema({
  delivery_courier: {
    type: String
  },

  delivery_fee: {
    type: Number,
    default: 0
  },

  delivery_address: {
    fullStreet: {
      type: String
    },

    fullName: {
      type: String
    },
  
    phoneNumber: {
      type: String
    },
    
    kelurahan: { 
      type: String
    },

    kecamatan: { 
      type: String
    },

    kabupaten: { 
      type: String
    },

    provinsi: { 
      type: String
    },
  },

  totalQty: {
    type: Number
  },

  subTotal: {
    type: Number
  },

  totalShopping: {
    type: Number
  },

  paymentMethod: {
    type: String,
    required: true
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

  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {timestamps: true});

const Invoice = model('Invoice', invoiceSchema);

module.exports = Invoice;
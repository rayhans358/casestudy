const mongoose = require('mongoose');
const Invoice = require('./invoiceModel');
const Payment = require('./paymentModel');
const { model, Schema } = mongoose;

const orderSchema = Schema({
  status: {
    type: String,
    enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
    default: 'waiting_payment'
  },

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
   type: Number,
   min: [1, 'Kuantitas minimal 1'],
   required: [true, 'Total Qty tidak boleh kosong']
 },

 subTotal: {
    type: Number,
    required: [true, 'Total harga item tidak boleh kosong']
  },

  totalShopping: {
    type: Number,
    required: [true, 'Total belanja tidak boleh kosong']
  },

  paymentMethod: {
    type: String,
    required: true
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  order_items: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderItem'
  }],

  order_number: {
    type: Number
  }

}, {timestamps: true});

orderSchema.pre('save', async function(next) {
  if (!this.order_number && this.order_number !== 0) {
    const highestOrder = await this.constructor.findOne({}, {}, { sort: { order_number: -1 } });
    if (highestOrder && highestOrder.order_number !== null) {
      this.order_number = highestOrder.order_number + 1;
    } else {
      this.order_number = 1;
    }
  }
  next();
});

orderSchema.post('save', async function() {
  const totalQty = this.order_items.reduce((total, item) => total + parseInt(item.qty), 0);
  const subTotal = this.order_items.reduce((total, item) => total += (item.price * item.qty), 0);

  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    delivery_courier: this.delivery_courier,
    delivery_fee: parseInt(this.delivery_fee),
    delivery_address: {
      fullName: this.delivery_address.fullName,
      phoneNumber: this.delivery_address.phoneNumber,
      fullStreet: this.delivery_address.fullStreet,
      kelurahan: this.delivery_address.kelurahan,
      kecamatan: this.delivery_address.kecamatan,
      kabupaten: this.delivery_address.kabupaten,
      provinsi: this.delivery_address.provinsi
    },
    totalQty: totalQty,
    subTotal: subTotal,
    totalShopping: parseInt(subTotal + this.delivery_fee),
    paymentMethod: this.paymentMethod
  });
  console.log(invoice.delivery_courier, 'invoice delivery_courier');
  console.log(invoice.totalQty, 'invoice totalQty');
  console.log(invoice.subTotal, 'invoice subTotal');
  console.log(invoice.totalShopping, 'invoice totalShopping');
  console.log(invoice.paymentMethod, 'invoice paymentMethod');
  console.log(invoice, 'invoice');
  await invoice.save();
});

const Order = model('Order', orderSchema);

module.exports = Order;
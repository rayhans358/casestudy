const { Schema, model } =require('mongoose');

const deliveryAddressSchema = Schema({
  fullName: {
    type: String,
    required: [true, 'Field name tidak boleh kosong'],
    maxlength: [255, 'Field name maksimal 255 karakter']
  },
  
  phoneNumber: {
    type: String,
    required: [true, 'Field nomor handphone harus diisi'],
    minlength: [9, 'Maksimal nomor handphone 9 karakter'],
    maxlength: [15, 'Maksimal nomor handphone 15 karakter']
  },

  fullStreet: {
    type: String,
    required: [true, 'Field detail alamat tidak boleh kosong'],
    maxlength: [1000, 'Field detail alamat maksimal 1000 karakter']
  },

  provinsi: {
    type: String
  },

  kabupaten: {
    type: String
  },

  kecamatan: {
    type: String
  },

  kelurahan: {
    type: String
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

const DeliveryAddress = model('DeliveryAddress', deliveryAddressSchema);

module.exports = DeliveryAddress;
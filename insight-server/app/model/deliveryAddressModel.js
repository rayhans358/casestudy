const { Schema, model } =require('mongoose');

const deliveryAddressSchema = Schema({
  name: {
    type: String,
    required: [true, 'Field name tidak boleh kosong'],
    maxlength: [255, 'Field name maksimal 255 karakter']
  },
  kelurahan: {
    type: String,
    required: [true, 'Field kelurahan tidak boleh kosong'],
    maxlength: [255, 'Field kelurahan maksimal 255 karakter']
  },
  kecamatan: {
    type: String,
    required: [true, 'Field kecamatan tidak boleh kosong'],
    maxlength: [255, 'Field kecamatan maksimal 255 karakter']
  },
  kabupaten: {
    type: String,
    required: [true, 'Field kabupaten tidak boleh kosong'],
    maxlength: [255, 'Field kabupaten maksimal 255 karakter']
  },
  provinsi: {
    type: String,
    required: [true, 'Field provinsi tidak boleh kosong'],
    maxlength: [255, 'Field provinsi maksimal 255 karakter']
  },
  detail: {
    type: String,
    required: [true, 'Field detail alamat tidak boleh kosong'],
    maxlength: [1000, 'Field detail alamat maksimal 1000 karakter']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

const DeliveryAddress = model('DeliveryAddress', deliveryAddressSchema);

module.exports = DeliveryAddress;
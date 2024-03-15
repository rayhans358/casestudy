const mongoose = require('mongoose');
const { model, Schema} = mongoose;

const miniMarketSchema = Schema ({
  name: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  }
});

const MiniMarket = model('MiniMarket', miniMarketSchema);

module.exports = MiniMarket;
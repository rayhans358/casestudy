const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');

const getProducts = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;

    let product = await Product
    .find()
    .skip(parseInt(skip))
    .limit(parseInt(limit));
    return res.json(product);
  } catch (err) {
    next(err);
  }
};

const postProducts = async (req, res, next) => {
  try{
    let payload = req.body;

    if(req.file) {
      let temp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootpath, `public/images/products/${filename}`);

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          let product = new Product({...payload, image_url: filename})
          await product.save()
          return res.json(product);
        } catch(err) {
          fs.unlinkSync(target_path);
          if(err && err.name === 'ValidationError'){
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            })
          }
          next(err);
        }
      });

      src.on('error', async() => {
        next(err);
      });

    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch(err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const putUpdateProducts = async (req, res, next) => {
  try{
    let payload = req.body;
    let { id } = req.params;
    
    if(req.file) {
      let temp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootpath, `public/images/products/${filename}`);

      // Untuk update gambar sebelumnya
      let result = await Product.findById(id);
      let currentImage = `${config.rootpath}/public/images/products/${result.image_url}`; 

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          };

          let product = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
          });
          return res.json(product);

        } catch(err) {
          fs.unlinkSync(target_path);
          if(err && err.name === 'ValidationError'){
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            })
          }
          next(err);
        }
      });

      src.on('error', async() => {
        next(err);
      });

    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      });
      return res.json(product);
    }
  } catch(err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const deleteProductByid = async (req, res, next) => {
  const { id } = req.params;

  try {
    let result = await Product.findByIdAndDelete(id);
    let currentImage = `${config.rootpath}/public/images/products/${result.image_url}`;
    if(fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    };
    return res.json(result);
  } catch(err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  postProducts,
  putUpdateProducts,
  deleteProductByid
}
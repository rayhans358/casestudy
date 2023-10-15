const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const Tag = require('../model/tagModel');

const getProducts = async (req, res, next) => {
  try {
    let { search, skip = 0, limit = 10, category = '', tags = [] } = req.query;
    let criteria = {};

    if (search) {
      criteria = { ...criteria, name: {$regex: new RegExp(search, 'i')} }
    }

    if (category.length) {
      let categoryResult = await Category.findOne({name: {$regex: new RegExp(category, 'i')} });

      if (categoryResult) {
        criteria = { ...criteria, category: categoryResult._id }
      }
    }

    if (tags.length) {
      let tagsResult = await Tag.find({name: {$in: tags}});

      if (tagsResult.length > 0) {
        criteria = { ...criteria, tags: {$in: tagsResult.map(tag => tag._id)} }
      }
    }

    let count = await Product.countDocuments(criteria);

    console.log(criteria);
    let product = await Product
    .find(criteria)
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .populate('category')
    .populate('tags')
    return res.json({
      data: product,
      count
    });
  } catch (err) {
    next(err);
  }
};

const postProducts = async (req, res, next) => {
  try{
    let payload = req.body;

    if (payload.category) {
      let category = 
        await Category
        .findOne({name: {$regex: payload.category, $options: 'i'}});
      if (category) {
        payload = {...payload, category: category._id};
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let tags = 
        await Tag
        .find({name: {$in: payload.tags}});
      if (tags.length) {
        payload = {...payload, tags: tags.map(tag => tag._id)};
      } else {
        delete payload.tags;
      }
    }

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
          return res.status(201).json(product);
        } catch(err) {
          fs.unlinkSync(target_path);
          if(err && err.name === 'ValidationError'){
            return res.status(400).json({
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
      return res.status(201).json(product);
    }
  } catch(err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
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

    if (payload.category) {
      let category = 
        await Category
        .findOne({name: {$regex: payload.category, $options: 'i'}});
      if (category) {
        payload = {...payload, category: category._id};
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let tags = 
      await Tag
      .find({name: {$in: payload.tags}});
        // console.log(payload.tags);
        // console.log(tags.length);
        // console.log(payload.tags.length);
      if (tags.length) {
        payload = {...payload, tags: tags.map(tag => tag._id)};
      } else {
        delete payload.tags;
      }
    }
    
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
          product.image_url = filename;
          await product.save();
          return res.status(200).json(product);

        } catch(err) {
          fs.unlinkSync(target_path);
          if(err && err.name === 'ValidationError'){
            return res.status(400).json({
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
      return res.status(200).json(product);
    }
  } catch(err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const deleteProductByid = async (req, res, next) => {
  try {
    let result = await Product.findByIdAndDelete(req.params.id);
    let currentImage = `${config.rootpath}/public/images/products/${result.image_url}`;

    console.log("config.rootpath:", config.rootpath);
    console.log("result.image_url:", result.image_url);
    console.log("currentImage:", currentImage);

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
      console.log("Image deleted successfully");
    } else {
      console.log("Image not found");
    }
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
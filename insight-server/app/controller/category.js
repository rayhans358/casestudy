const Category = require('../model/categoryModel');

const getCategory = async (req, res, next) => {
  try {
    let category = await Category.find();
    return res.status(200).json(category);
    
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  let { id } = req.params;

  try {
    let category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        error: 1,
        message: 'Category not found'
      });
    }
    return res.status(200).json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
}

const postCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.status(201).json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const putUpdateCategory = async (req, res, next) => {
  let { id } = req.params;

  try {
    let payload = req.body;
    let category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return res.status(200).json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const deleteCategoryByid = async (req,res, next) => {
  let { id } = req.params;

  try {
    let category = await Category.findByIdAndDelete(id);
    return res.status(200).json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

module.exports = {
  getCategory,
  getCategoryById,
  postCategory,
  putUpdateCategory,
  deleteCategoryByid
}
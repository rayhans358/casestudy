const Category = require('../model/categoryModel');

const getCategory = async (req, res, next) => {
  try {
    let category = await Category.find();
    return res.json(category);
    
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json ({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const postCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json ({
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
    return res.json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json ({
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
    return res.json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json ({
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
  postCategory,
  putUpdateCategory,
  deleteCategoryByid
}
const Tag = require('../model/tagModel');

const getTag = async (req, res, next) => {
  try {
    let tag = await Tag.find();
    return res.status(200).json(tag);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const getTagById = async (req, res, next) => {
  let { id } = req.params;

  try {
    let tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({
        error: 1,
        message: 'Tag not found'
      });
    }
    return res.status(200).json(tag);

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
};

const postTag = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = new Tag(payload);
    await tag.save();
    return res.status(201).json(tag);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const putUpdateTag = async (req, res, next) => {
  let { id } = req.params;

  try {
    let payload = req.body;
    let tag = await Tag.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return res.status(200).json(tag);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const deleteTagByid = async (req, res, next) => {
  let { id } = req.params;

  try {
    let tag = await Tag.findByIdAndDelete(id);
    return res.status(200).json(tag);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

module.exports = {
  getTag,
  getTagById,
  postTag,
  putUpdateTag,
  deleteTagByid
}
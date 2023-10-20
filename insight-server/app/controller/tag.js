const Tag = require('../model/tagModel');

const getTag = async (req, res, next) => {
  try {
    let tag = await Tag.find();
    return res.json(tag);
  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.json({
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
    return res.json(tag);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.json({
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
    return res.json(tag);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.json({
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
    return res.json(tag);

  } catch (err) {
    if (err & err.name === 'ValidationError') {
      return res.json({
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
  postTag,
  putUpdateTag,
  deleteTagByid
}
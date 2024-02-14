const path = require('path');
const fs = require('fs');
const config = require('../config');
const Bank = require("../model/bankModel");

const getAllBanks = async (req, res, next) => {
  try {
    const banks = await Bank.find();
    return res.status(200).json({ 
      data: banks 
    });

  } catch (err) {
    console.error('Error getting all bank data:', err);
    next(err);
    return res.status(500).json({
      err: 'Internal Server Error' 
    });
  };
};

const postNameBanks = async(req, res, next) => {
  try {
    const payload = req.body;

    if (!payload) {
      return res.status(400).json({ 
        error: 'Name and image are required' 
      });
    };

    if(req.file) {
      const temp_path = req.file.path;
      const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      const filename = req.file.filename + '.' + originalExt;
      const target_path = path.resolve(config.rootpath, `public/images/banks/${filename}`);

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          const newBank = new Bank({
            ...payload, 
            image_url: filename
          })
          await newBank.save()
          return res.status(201).json({ 
            data: newBank 
          });

        } catch(err) {
          fs.unlinkSync(target_path);
          next(err);
        };
      });

      src.on('error', async() => {
        next(err);
      });
      
    } else {
      const newBank = new Bank(payload);
      await newBank.save();
      return res.status(201).json({ 
        data: newBank 
      });
    };

  } catch (err) {
    console.error('Error saving bank data:', err);
    next(err);
    return res.status(500).json({ 
      err: 'Internal Server Error' 
    });
  };
};

const putUpdateBanks = async(req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if(req.file) {
      const temp_path = req.file.path;
      const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      const filename = req.file.filename + '.' + originalExt;
      const target_path = path.resolve(config.rootpath, `public/images/banks/${filename}`);

      const updateBank = await Bank.findById(id);
      const currentImage = `${config.rootpath}/public/images/banks/${updateBank.image_url}`; 

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          };

          const updateBank = await Bank.findByIdAndUpdate(
            id, 
            payload, 
            { new: true }
          );
          updateBank.image_url = filename;
          await updateBank.save();
          return res.status(200).json({ 
            data: updateBank
          });

        } catch(err) {
          fs.unlinkSync(target_path);
          next(err);
        };
      });

      src.on('error', async() => {
        next(err);
      });

    } else {
      const updateBank = await Bank.findByIdAndUpdate(
        id, 
        payload, 
        { new: true }
      );

      if (!updateBank) {
        return res.status(404).json({
          err: 'Bank not found'
        });
      };

      return res.status(200).json({ 
        data: updateBank
      });
    };

  } catch (err) {
    console.error('Error updating bank data:', err);
    next(err);
    return res.status(500).json({ 
      err: 'Internal Server Error' 
    });
  };
};

const deleteBanksById = async(req, res, next) => {
  try {
    const { id } = req.params;
    const deleteBank = await Bank.findByIdAndDelete(id);
    const currentImage = `${config.rootpath}/public/images/banks/${deleteBank.image_url}`;

    if (!deleteBank) {
      return res.status(404).json({ 
        error: 'Bank not found' 
      });
    };

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    };

    return res.status(200).json({ 
      data: deleteBank 
    });

  } catch (err) {
    console.error('Error deleting bank by id:', err);
    next(err);
    return res.status(500).json({ 
      err: 'Internal Server Error' 
    });
  };
};

module.exports ={
  getAllBanks,
  postNameBanks,
  putUpdateBanks,
  deleteBanksById
}
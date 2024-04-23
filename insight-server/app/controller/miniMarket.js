const path = require('path');
const fs = require('fs');
const config = require('../config');
const MiniMarket = require('../model/miniMarketModel');

const getAllMiniMarkets = async (req, res, next) => {
  try {
    const miniMarkets = await MiniMarket.find();
    return res.status(200).json({ 
      data: miniMarkets 
    });

  } catch (err) {
    console.error('Error getting all mini market data:', err);
    next(err);
    return res.status(500).json({
      err: 'Internal Server Error' 
    });
  };
};

const getMiniMarketById = async (req, res, next) => {
  try {
    const miniMarketId = req.req.params.id;
    const miniMarket = await MiniMarket.findById(miniMarketId);
    if (!miniMarket) {
      return res.status(404).json({ 
        error: 'Mini Market not found' 
      });
    };
    return res.status(200).json({
      data: miniMarket
    });
    
  } catch (wee) {
    console.error('Error getting mini market by id:', err);
    next(err);
    return res.status(500).json({
      err: 'Internal Server Error' 
    });
  };
};

const postNameMiniMarkets = async(req, res, next) => {
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
      const target_path = path.resolve(config.rootpath, `public/images/mini-markets/${filename}`);

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          const newMiniMarket = new MiniMarket({
            ...payload, 
            image_url: filename
          })
          await newMiniMarket.save()
          return res.status(201).json({ 
            data: newMiniMarket 
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
      const newMiniMarket = new MiniMarket(payload);
      await newMiniMarket.save();
      return res.status(201).json({ 
        data: newMiniMarket 
      });
    };

  } catch (err) {
    console.error('Error saving mini market data:', err);
    next(err);
    return res.status(500).json({ 
      err: 'Internal Server Error' 
    });
  };
};

const putUpdateMiniMarkets = async(req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if(req.file) {
      const temp_path = req.file.path;
      const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      const filename = req.file.filename + '.' + originalExt;
      const target_path = path.resolve(config.rootpath, `public/images/mini-markets/${filename}`);

      const updateMiniMarket = await MiniMarket.findById(id);
      const currentImage = `${config.rootpath}/public/images/mini-markets/${updateMiniMarket.image_url}`; 

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          };

          const updateMiniMarket = await MiniMarket.findByIdAndUpdate(
            id, 
            payload, 
            { new: true }
          );
          updateMiniMarket.image_url = filename;
          await updateMiniMarket.save();
          return res.status(200).json({ 
            data: updateMiniMarket
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
      const updateMiniMarket = await MiniMarket.findByIdAndUpdate(
        id, 
        payload, 
        { new: true }
      );

      if (!updateMiniMarket) {
        return res.status(404).json({
          err: 'Mini Market not found'
        });
      };

      return res.status(200).json({ 
        data: updateMiniMarket
      });
    };

  } catch (err) {
    console.error('Error updating mini market data:', err);
    next(err);
    return res.status(500).json({ 
      err: 'Internal Server Error' 
    });
  };
};

const deleteMiniMarketsById = async(req, res, next) => {
  try {
    const { id } = req.params;
    const deleteMiniMarket = await MiniMarket.findByIdAndDelete(id);
    const currentImage = `${config.rootpath}/public/images/mini-markets/${deleteMiniMarket.image_url}`;

    if (!deleteMiniMarket) {
      return res.status(404).json({ 
        error: 'MiniMarket not found' 
      });
    };

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    };

    return res.status(200).json({ 
      data: deleteMiniMarket 
    });

  } catch (err) {
    console.error('Error deleting mini market by id:', err);
    next(err);
    return res.status(500).json({ 
      err: 'Internal Server Error' 
    });
  };
};

module.exports = {
  getAllMiniMarkets,
  getMiniMarketById,
  postNameMiniMarkets,
  putUpdateMiniMarkets,
  deleteMiniMarketsById
}
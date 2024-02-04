const { default: fetch } = require("node-fetch");

let banksData = [];

const getAllBanks = (req, res, next) => {
  try {
    res.json({ success: true, data: banksData });
  } catch (err) {
    res.status(500).json({ success: false, err: 'Get Bank Error' });
    next(err)
  };
};

const fetchAccountNumber = async () => {
  try {
    const response = await fetch('https://random-data-api.com/api/v2/banks');
    const data = await response.json();
    return data.account_number;
  } catch (error) {
    console.error('Error fetching account number:', error);
    throw error;
  };
};

const postNameBank = async(req, res, next) => {
  try {
    const { bankName, bankImage } = req.body;
    const savedData = { bankName, bankImage };
    banksData.push(savedData);
    res.json({ success: true, data: savedData });
  } catch (err) {
    res.status(500).json({ success: false, err: 'Save Bank Error' });
    next(err)
  };
};

module.exports ={
  getAllBanks,
  postNameBank
}
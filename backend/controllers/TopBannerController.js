const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "TopBanner";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}

const topBannerSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  TB_IMG: { type: String },
  TB_LINK: { type: String }
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, topBannerSchema);

async function addTopBanner(req, res) {
  try {
    const TopBanner = req.body;
    TopBanner.ID = await getNextDataId(DataModel);

    await insertData(TopBanner, DataModel); 

    console.log('TopBanner added successfully');
    res.status(200).json({ status : true ,  message: 'TopBanner added successfully' });
  } catch (error) {
    console.error('Failed to insert TopBanner:', error);
    res.status(500).json({ error: error.message });
  }
}


async function listTopBanners(req, res) {
  try {
    const data = await getData(DataModel); 
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve TopBanners:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateTopBanner(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel); 

    console.log('TopBanner updated successfully');
    res.status(200).json({ status : true ,  message: 'TopBanner updated successfully' });
  } catch (error) {
    console.error('Failed to update TopBanner:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteTopBanner(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('TopBanner deleted successfully');
    res.status(200).json({ status : true ,  message: 'TopBanner deleted successfully' });
  } catch (error) {
    console.error('Failed to delete TopBanner:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getTopBannerById(req, res) {
  try {
    const { id } = req.params;
    
    const TopBanner = await getDataById(id, DataModel); 
    if (!TopBanner) {
      return res.status(404).json({ error: 'TopBanner not found '});
    }
 
    res.status(200).json(TopBanner);
  } catch (error) {
    console.error('Failed to retrieve TopBanner:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addTopBanner, listTopBanners, updateTopBanner, deleteTopBanner, getTopBannerById };

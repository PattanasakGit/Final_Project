const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "SideBanner";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}

const SideBannerSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  SB_IMG: { type: String },
  SB_LINK: { type: String }
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, SideBannerSchema);

async function addSideBanner(req, res) {
  try {
    const SideBanner = req.body;
    SideBanner.ID = await getNextDataId(DataModel);

    await insertData(SideBanner, DataModel); 

    console.log('SideBanner added successfully');
    res.status(200).json({ status : true ,   message: 'SideBanner added successfully' });
  } catch (error) {
    console.error('Failed to insert SideBanner:', error);
    res.status(500).json({ error: error.message });
  }
}

async function listSideBanners(req, res) {
  try {
    const data = await getData(DataModel); 
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve SideBanners:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateSideBanner(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel); 

    console.log('SideBanner updated successfully');
    res.status(200).json({ status : true ,   message: 'SideBanner updated successfully' });
  } catch (error) {
    console.error('Failed to update SideBanner:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteSideBanner(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('SideBanner deleted successfully');
    res.status(200).json({ status : true ,   message: 'SideBanner deleted successfully' });
  } catch (error) {
    console.error('Failed to delete SideBanner:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getSideBannerById(req, res) {
  try {
    const { id } = req.params;
    
    const SideBanner = await getDataById(id, DataModel); 
    if (!SideBanner) {
      return res.status(404).json({ error: 'SideBanner not found '});
    }
 
    res.status(200).json(SideBanner);
  } catch (error) {
    console.error('Failed to retrieve SideBanner:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addSideBanner, listSideBanners, updateSideBanner, deleteSideBanner, getSideBannerById };

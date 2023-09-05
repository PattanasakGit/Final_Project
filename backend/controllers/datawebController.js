const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "dataweb";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}

const dataWebSchema = new Schema({
    ID: { type: Number, required: true, unique: true },
    W_NAME: { type: String },
    W_ADDR: { type: String },
    W_CONTACT: { type: String },
    W_EMAIL: { type: String },
    ABOUT_WEB: { type: String },
    W_IMG: { type: String }
  }, { versionKey: false });

const DataModel = mongoose.model(str_collection, dataWebSchema);

async function addDataWeb(req, res) {
  try {
    const DataWeb = req.body;
    DataWeb.ID = await getNextDataId(DataModel);

    await insertData(DataWeb, DataModel); 

    console.log('DataWeb added successfully');
    res.status(200).json({ status : true ,   message: 'DataWeb added successfully' });
  } catch (error) {
    console.error('Failed to insert DataWeb:', error);
    res.status(500).json({ error: error.message });
  }
}


async function listDataWebs(req, res) {
  try {
    const data = await getData(DataModel); 

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve DataWebs:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateDataWeb(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel);
    console.log('DataWeb updated successfully');
    res.status(200).json({ status : true ,   message: 'DataWeb updated successfully' });
  } catch (error) {
    console.error('Failed to update DataWeb:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteDataWeb(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('DataWeb deleted successfully');
    res.status(200).json({ status : true ,   message: 'DataWeb deleted successfully' });
  } catch (error) {
    console.error('Failed to delete DataWeb:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getDataWebById(req, res) {
  try {
    const { id } = req.params;
    
    const DataWeb = await getDataById(id, DataModel); 

    if (!DataWeb) {
      return res.status(404).json({ error: 'DataWeb not found '});
    }
 
    res.status(200).json(DataWeb);
  } catch (error) {
    console.error('Failed to retrieve DataWeb:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addDataWeb, listDataWebs, updateDataWeb, deleteDataWeb, getDataWebById };

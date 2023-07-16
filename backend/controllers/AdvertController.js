const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "Advert";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('DD-MM-YYYY HH:mm:ss');
  return formattedDate;
}

const advertSchema = new Schema({
    ID: { type: Number, required: true, unique: true },
    Ad_NAME: { type: String },
    Ad_IMG: { type: String },
    P_ID: { type: String }
  }, { versionKey: false });

const DataModel = mongoose.model(str_collection, advertSchema);

async function addAdvert(req, res) {
  try {
    const Advert = req.body;
    Advert.ID = await getNextDataId(DataModel);

    await insertData(Advert, DataModel); 

    console.log('Advert added successfully');
    res.status(200).json({ message: 'Advert added successfully' });
  } catch (error) {
    console.error('Failed to insert Advert:', error);
    res.status(500).json({ error: error.message });
  }
}


async function listAdverts(req, res) {
  try {
    const data = await getData(DataModel);

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve Adverts:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateAdvert(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel); 

    console.log('Advert updated successfully');
    res.status(200).json({ message: 'Advert updated successfully' });
  } catch (error) {
    console.error('Failed to update Advert:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteAdvert(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('Advert deleted successfully');
    res.status(200).json({ message: 'Advert deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Advert:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getAdvertById(req, res) {
  try {
    const { id } = req.params;
    
    const Advert = await getDataById(id, DataModel); 

    if (!Advert) {
      return res.status(404).json({ error: 'Advert not found '});
    }
 
    res.status(200).json(Advert);
  } catch (error) {
    console.error('Failed to retrieve Advert:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addAdvert, listAdverts, updateAdvert, deleteAdvert, getAdvertById };

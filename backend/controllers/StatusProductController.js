const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "StatusProduct";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('DD-MM-YYYY HH:mm:ss');
  return formattedDate;
}

const StatusProductSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  SP_NAME: { type: String }
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, StatusProductSchema);

async function addStatusProduct(req, res) {
  try {
    const StatusProduct = req.body;
    StatusProduct.ID = await getNextDataId(DataModel);

    await insertData(StatusProduct, DataModel); // เพิ่มผู้ใช้ในฐานข้อมูล

    console.log('StatusProduct added successfully');
    res.status(200).json({ status : true ,   message: 'StatusProduct added successfully' });
  } catch (error) {
    console.error('Failed to insert StatusProduct:', error);
    res.status(500).json({ error: error.message });
  }
}


async function listStatusProducts(req, res) {
  try {
    const data = await getData(DataModel); // ดึงข้อมูลผู้ใช้จากฐานข้อมูล

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve StatusProducts:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateStatusProduct(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel); // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล

    console.log('StatusProduct updated successfully');
    res.status(200).json({ status : true ,   message: 'StatusProduct updated successfully' });
  } catch (error) {
    console.error('Failed to update StatusProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteStatusProduct(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel); // ลบข้อมูลผู้ใช้จากฐานข้อมูล

    console.log('StatusProduct deleted successfully');
    res.status(200).json({ status : true ,   message: 'StatusProduct deleted successfully' });
  } catch (error) {
    console.error('Failed to delete StatusProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getStatusProductById(req, res) {
  try {
    const { id } = req.params;
    
    const StatusProduct = await getDataById(id, DataModel); // ค้นหาข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ ID

    if (!StatusProduct) {
      return res.status(404).json({ error: 'StatusProduct not found '});
    }
 
    res.status(200).json(StatusProduct);
  } catch (error) {
    console.error('Failed to retrieve StatusProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addStatusProduct, listStatusProducts, updateStatusProduct, deleteStatusProduct, getStatusProductById };

const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId } = require('../database/Database.js');
var str_collection = "Advert";

const { update_Ads } = require('./productController.js')

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}

const advertSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  // Ad_NAME: { type: String },
  Ad_IMG: { type: String },
  Ad_CREATE_BILL: { type: String },
  Ad_CHECKED: { type: Boolean },
  P_ID: { type: Number }
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, advertSchema);

async function addAdvert(req, res) {
  try {
    const Advert = req.body;
    Advert.ID = await getNextDataId(DataModel);
    Advert.Ad_CREATE_BILL = formatDate(new Date());
    Advert.Ad_CHECKED = false;

    await insertData(Advert, DataModel);

    console.log('Advert added successfully');
    res.status(200).json({ status: true, message: 'Advert added successfully' });
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

    const product_ID_find = await DataModel.findOne({ ID: id }).exec(); // หา P_ID ด้วย ID ของ Ads
    const product_ID = product_ID_find.P_ID;
    if (product_ID) {
      await updateData(id, newData, DataModel);
      // ให้ทำการอัพเดตข้อมูลในส่วนของสถานะโฆษณาตัวของประกาศขาย
      await update_Ads(product_ID, true);
    }else{
      res.status(500).json({ error: 'รหัสข้อผิดพลาด'+'Ads_ID = '+id+' P_ID = '+product_ID });
    }


    console.log('Advert updated successfully');
    res.status(200).json({ status: true, message: 'Advert updated successfully' });
  } catch (error) {
    console.error('Failed to update Advert:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteAdvert(req, res) {
  try {
    const { id } = req.params;

    const product_ID_find = await DataModel.findOne({ ID: id }).exec(); // หา P_ID ด้วย ID ของ Ads
    const product_ID = product_ID_find.P_ID;
    if (product_ID) {
      await deleteData(id, DataModel);
      // ให้ทำการอัพเดตข้อมูลในส่วนของสถานะโฆษณาตัวของประกาศขาย
      await update_Ads(product_ID, false);
    }else{
      res.status(500).json({ error: 'รหัสข้อผิดพลาด'+'Ads_ID = '+id+' P_ID = '+product_ID });
    }

    console.log('Advert deleted successfully');
    res.status(200).json({ status: true, message: 'Advert deleted successfully' });
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
      return res.status(404).json({ error: 'Advert not found ' });
    }

    res.status(200).json(Advert);
  } catch (error) {
    console.error('Failed to retrieve Advert:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getAdvertByProduct(req, res) {
  try {
    const { id } = req.params;

    // const Advert = await getDataById(id, DataModel);
    const Advert = await DataModel.findOne({ P_ID: id });

    if (!Advert) {
      return res.status(500).json({ error: 'Advert not found ' });
    }

    res.status(200).json(Advert);
  } catch (error) {
    console.error('Failed to retrieve Advert:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addAdvert, listAdverts, updateAdvert, deleteAdvert, getAdvertById, getAdvertByProduct };





// // ฟังก์ชันนี้จะตรวจสอบ วันหมดอายุของ การลงโฆษณาประกาศขาย และอัพเดตหากหมดอายุแล้ว
// async function Check_Ads_Product() {

//   const id = 4;

//   const product_ID = await DataModel.findOne({ ID: id }, { P_ID: 1, _id: 0 }).exec();
//   console.log('Ads_ID = '+ id +'------->',product_ID.P_ID);

// }

// setInterval(Check_Ads_Product, 1000);
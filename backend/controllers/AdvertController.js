const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, updateData, deleteData, getDataById, getNextDataId, getData } = require('../database/Database.js');
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
    await deleteAdvert_not_need();
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
    } else {
      res.status(500).json({ error: 'รหัสข้อผิดพลาด' + 'Ads_ID = ' + id + ' P_ID = ' + product_ID });
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
    } else {
      res.status(500).json({ error: 'รหัสข้อผิดพลาด' + 'Ads_ID = ' + id + ' P_ID = ' + product_ID });
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

const deleteAdvert_not_need = async () => {
  const command_for_get_Data_NotNeed = [
    {
      $lookup: {
        from: "products",
        localField: "P_ID", 
        foreignField: "ID",
        as: "product_in_ADS" 
      }
    },
    {
      $unwind: "$product_in_ADS"
    },
    {
      $match: {
        "product_in_ADS.P_ADS": false, //สินค้าไม่โฆษณาแล้ว
        "Ad_CHECKED": true //แต่ admin ยังเห็นอยู่
      }
    }
  ];
  
  try {
    const data = await DataModel.aggregate(command_for_get_Data_NotNeed).exec();
    if(data){
      for(let OneData of data){
        await deleteData(OneData.ID, DataModel); //ให้ลบรายการออกจากฝั่ง admin
        console.log('ลบรายการ ADS ที่ไม่จำเป็นเสร็จสิ้น Ad_ID = ',OneData.ID);
      }
    }
  } catch (error) {
    console.error('พบข้อผิดพลาดในการลบรายการที่ไม่จำเป็น', error);
  }
}

module.exports = { addAdvert, listAdverts, updateAdvert, deleteAdvert, getAdvertById, getAdvertByProduct };
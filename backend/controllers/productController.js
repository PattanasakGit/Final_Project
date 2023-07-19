const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "Product";

function formatDate(date) {
    const formattedDate = moment(date).utcOffset('+07:00').format('DD-MM-YYYY HH:mm:ss');
    return formattedDate;
  }  

const productSchema = new Schema({
    ID: { type: Number, required: true, unique: true },
    P_NAME: { type: String, required: true },
    P_CATEGORY: { type: String, required: true },
    P_PRICE: { type: Number, required: true },
    P_TEXT: { type: String },
    P_IMG: { type: String },
    P_PHONE: { type: String, required: true },
    P_POST: { type: String },
    P_TYPE: { type: String, required: true },
    P_STATUS: { type: Number },
    U_ID: { type: Number }
  }, { versionKey: false });

//=========================== เพิ่ม validator ใน Schema===================================

productSchema.path('P_PRICE').validate(function (price) {
  return price >= 0;
}, 'ราคาต้องมีค่ามากกว่าหรือเท่ากับ 0');

productSchema.path('P_PHONE').validate(function (phone) {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(phone);
}, 'เบอร์โทรศัพท์ไม่ถูกต้อง');

//=========================== เพิ่ม validator ใน Schema===================================

const DataModel = mongoose.model(str_collection, productSchema);

async function addProduct(req, res) {
  try {
    const Product = req.body;
    Product.ID = await getNextDataId(DataModel);
    Product.P_POST = formatDate(new Date());

    await insertData(Product, DataModel); // เพิ่มผู้ใช้ในฐานข้อมูล

    console.log('Product added successfully');
    res.status(200).json({ status : true ,   message: 'Product added successfully' });
  } catch (error) {
    console.error('Failed to insert Product:', error);
    res.status(500).json({ error: error.message });
  }
}


async function listProducts(req, res) {
  try {
    const data = await getData(DataModel); // ดึงข้อมูลผู้ใช้จากฐานข้อมูล

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve Products:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel); // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล

    console.log('Product updated successfully');
    res.status(200).json({ status : true ,   message: 'Product updated successfully' });
  } catch (error) {
    console.error('Failed to update Product:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel); // ลบข้อมูลผู้ใช้จากฐานข้อมูล

    console.log('Product deleted successfully');
    res.status(200).json({ status : true ,   message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Product:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    
    const Product = await getDataById(id, DataModel); // ค้นหาข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ ID

    if (!Product) {
      return res.status(404).json({ error: 'Product not found '});
    }
 
    res.status(200).json(Product);
  } catch (error) {
    console.error('Failed to retrieve Product:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addProduct, listProducts, updateProduct, deleteProduct, getProductById };

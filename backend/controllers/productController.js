const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId, getUserBy_Email } = require('../database/Database.js');
const { getUserModel } = require('../controllers/userController.js');
const { Send_Email_after_checkd, Send_Email_after_checkd_Ads } = require('../controllers/MailController.js');

var str_collection = "Product";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}

const productSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  P_NAME: { type: String, required: true },
  P_CATEGORY: { type: String, required: true },
  P_PRICE: { type: Number, required: true },
  P_TEXT: { type: String },
  P_IMG: [{ type: String }],
  P_PHONE: { type: String, required: true },
  P_POST: { type: String },
  P_UPDATE: { type: String },
  P_TYPE: { type: String, required: true },
  P_STATUS: { type: String, required: true },
  P_ADS: { type: Boolean },
  P_ADS_Limit_time: { type: String },
  U_EMAIL: { type: String, required: true },
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, productSchema);

function getProductDataModel() {
  return DataModel;
}

//=========================== เพิ่ม validator ใน Schema===================================

productSchema.path('P_PRICE').validate(function (price) {
  return price >= 0;
}, 'ราคาต้องมีค่ามากกว่าหรือเท่ากับ 0');

productSchema.path('P_PHONE').validate(function (phone) {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(phone);
}, 'เบอร์โทรศัพท์ไม่ถูกต้อง');

//=========================== เพิ่ม validator ใน Schema===================================

async function addProduct(req, res) {
  try {
    const Product = req.body;
    Product.ID = await getNextDataId(DataModel);
    Product.P_POST = formatDate(new Date());
    Product.P_UPDATE = Product.P_POST;
    Product.P_ADS = false;
    Product.P_STATUS = 'รอตรวจสอบ'; //ทุกการบันทึกจะมีสถานะ 1 --> รอการตรวจสอบ

    await insertData(Product, DataModel); // เพิ่มผู้ใช้ในฐานข้อมูล

    console.log('Product added successfully');
    res.status(200).json({ status: true, message: 'Product added successfully' });
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
    newData.P_UPDATE = formatDate(new Date());

    await updateData(id, newData, DataModel); // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล

    console.log('Product updated successfully');
    res.status(200).json({ status: true, message: 'Product updated successfully' });
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
    res.status(200).json({ status: true, message: 'Product deleted successfully' });
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
      return res.status(404).json({ error: 'Product not found ' });
    }

    res.status(200).json(Product);
  } catch (error) {
    console.error('Failed to retrieve Product:', error);
    res.status(500).json({ error: error.message });
  }
}
//==================================== สำหรับการค้นหาข้อมูล  ===================================================
async function getProductByName(req, res) {
  try {
    const { Name } = req.params;
    const name = new RegExp(Name, 'i'); // 'ค้นหาหมดไม่สน เล็กใหญ่'
    const Product = await DataModel.find({ P_NAME: name }).exec();
    if (!Product) {
      return res.status(404).json({ error: 'ไม่พบรายการที่ตรงกับชื่อการค้นหา' });
    }
    res.status(200).json(Product);
  } catch (error) {
    console.error('Failed to retrieve Product:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getProductByCATEGORY(req, res) {
  try {
    const { C } = req.params;
    const CATEGORY = new RegExp(C, 'i'); // 'ค้นหาหมดไม่สน เล็กใหญ่'
    const Product = await DataModel.find({ P_CATEGORY: CATEGORY }).exec();
    if (!Product) {
      return res.status(404).json({ error: 'ไม่พบรายการที่ตรงกับชื่อการค้นหา' });
    }
    res.status(200).json(Product);
  } catch (error) {
    console.error('Failed to retrieve Product:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getProductTYPE(req, res) {
  try {
    const { T } = req.params;
    const Type = new RegExp(T, 'i'); // 'ค้นหาหมดไม่สน เล็กใหญ่'
    const Product = await DataModel.find({ P_TYPE: Type }).exec();
    if (!Product) {
      return res.status(404).json({ error: 'ไม่พบรายการที่ตรงกับชื่อการค้นหา' });
    }
    res.status(200).json(Product);
  } catch (error) {
    console.error('Failed to retrieve Product:', error);
    res.status(500).json({ error: error.message });
  }
}

async function ListProduct_for_one_user(req, res,) {
  try {
    const { email } = req.body;

    const user = await getUserBy_Email(email, getUserModel());  //getUserModel() ต้องเรียกใช้แบบใช้งาน fn เพราะประกาศไว้แบบ fn() 
    if (!user) {
      return res.status(404).json({ error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' });
    }
    const Products = await DataModel.find({ U_EMAIL: user.U_EMAIL }).sort({ ID: -1 }).exec();
    res.status(200).json(Products);
  } catch (error) {
    console.error('พบข้อผิดพลาด:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getProductByMultipleConditions(req, res) {
  try {
    const { nameProduct, category, type, minPrice, maxPrice } = req.body;
    let conditions = { P_STATUS: "กำลังประกาศขาย" };

    // ตรวจสอบเงื่อนไขการค้น ชื่อ
    if (nameProduct) {
      const typeRegex = new RegExp(nameProduct, 'i'); // i หมายถึงไม่สนใจตัวอักษรใหญ่เล็ก
      conditions.P_NAME = typeRegex;
    }

    // ตรวจสอบเงื่อนไขการค้น ว่าสินค้ามือหนึง/มือสอง
    if (type) {
      const typeRegex = new RegExp(type, 'i'); // i หมายถึงไม่สนใจตัวอักษรใหญ่เล็ก
      conditions.P_TYPE = typeRegex;
    }

    // ตรวจสอบเงื่อนไขการค้นหาหมวดหมู่สินค้า
    if (category) {
      const categoryRegex = new RegExp(category, 'i'); // i หมายถึงไม่สนใจตัวอักษรใหญ่เล็ก
      conditions.P_CATEGORY = categoryRegex;
    }

    // ตรวจสอบเงื่อนไขการค้นหาราคาสินค้า
    if (minPrice || maxPrice) {
      conditions.P_PRICE = {};
      if (minPrice) {
        conditions.P_PRICE.$gte = Number(minPrice);
      }
      if (maxPrice) {
        conditions.P_PRICE.$lte = Number(maxPrice);
      }
    }

    // const Product = await DataModel.find(conditions).exec();
    const Product = await DataModel.find(conditions).sort({ ID: -1 }).exec();

    if (Product.length === 0) {
      return res.status(404).json({ error: 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา' });
    }

    res.status(200).json(Product);
  } catch (error) {
    console.error('Failed to retrieve Product:', error);
    res.status(500).json({ error: error.message });
  }
}

// updat status by admin
async function updateProductByAdmin(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;
    const SEND_EMAIL_TO = newData.SEND_EMAIL_TO;
    newData.P_UPDATE = formatDate(new Date());

    await updateData(id, newData, DataModel); // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล

    console.log('Product updated successfully');
    res.status(200).json({ status: true, message: 'Product updated successfully' });
    await Send_Email_after_checkd(SEND_EMAIL_TO, newData);
  } catch (error) {
    console.error('Failed to update Product:', error);
    res.status(500).json({ error: error.message });
  }
}

async function update_Ads(id, status) {
  try {
    const Product = await getDataById(id, DataModel);
    if (Product) {
      if (status === true) { // admin กดอนุมัติให้โฆษณา
        const currentDate = new Date();
        const currentDate_plus_29 = currentDate.setDate(currentDate.getDate() + 29);
        const data_for_update = {
          P_ADS: true,
          P_ADS_Limit_time: formatDate(currentDate_plus_29)
        }
        Send_Email_after_checkd_Ads(Product.U_EMAIL, Product, true, formatDate(currentDate_plus_29));
        await updateData(id, data_for_update, DataModel);
        return true;
      } else { // admin ทำการยกกเลิก โฆาณา
        const data_for_update = {
          P_ADS: false,
          P_ADS_Limit_time: formatDate(new Date())
        }
        Send_Email_after_checkd_Ads(Product.U_EMAIL, Product, false, formatDate(new Date()));
        await updateData(id, data_for_update, DataModel);
        return true;
      }
    }
  } catch (error) {
    return false;
  }
}

//==================================== สำหรับการค้นหาข้อมูล  ===================================================

module.exports = {
  addProduct,
  listProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductDataModel,
  getProductByName,
  getProductByCATEGORY,
  getProductTYPE,
  getProductByMultipleConditions,
  ListProduct_for_one_user,
  updateProductByAdmin,
  update_Ads

};
// ฟังก์ชันนี้จะตรวจสอบ วันหมดอายุของ การลงโฆษณาประกาศขาย และอัพเดตหากหมดอายุแล้ว 
async function Check_Ads_Product() {
  console.log('----------- รายการผลตรวจสอบโฆษณา ----------------');
  const current_time = formatDate(new Date());
  const All_Product_Ads = await DataModel.find({ P_ADS: true }).exec();

  if (!All_Product_Ads) {
    console.log('All_Product_Ads ------> ไม่พบข้อมูลสินค้าที่โฆษณา');
    return false;
  }
  for (let oneProductAds of All_Product_Ads) {
    const time_Ads_for_check = oneProductAds.P_ADS_Limit_time;
    if (time_Ads_for_check < current_time) {
      console.log('P_ID = ' + oneProductAds.ID + '  ❌ หมดอายุแล้ว ❌');
      update_Ads(oneProductAds.ID, false); // ทำการยกเลิก โฆษณา

    } else if (time_Ads_for_check > current_time) {
      console.log('P_ID = ' + oneProductAds.ID + ' ✅ ยังไม่หมดอายุ ✅');
    } else {
      console.log('พบข้อผิดพลาดในการตรวจสอบเวลาหมดอายุ');
    }
  }
  console.log('-------------------------------------------------');
}

setInterval(Check_Ads_Product, 1000 * 60 * 60 * 24);
// setInterval(Check_Ads_Product, 1000 * 3);
const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getNextDataId } = require('../database/Database.js');

var str_collection = "TP_VerifyEmail";

const VerifySchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  EMAIL: { type: String },
  CODE_VERIFY: { type: String },
  IS_VERIFY: { type: Boolean },
  DATA_CEATE: { type: String },

}, { versionKey: false });
const DataModel = mongoose.model(str_collection, VerifySchema);

function getVerifySchema() {
  return DataModel
}

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}
async function TP_VerifyEmail(email, Code_verify_Email) {
  try {
    const data = {
      EMAIL: email,
      CODE_VERIFY: Code_verify_Email,
      IS_VERIFY: false,
      DATA_CEATE: formatDate(new Date())
    };
    data.ID = await getNextDataId(DataModel);

    await insertData(data, DataModel);

    // return true ; // ถ้าตรวจสอบแล้วถูกต้อง return true บอกว่าบันทึก User ได้ //ส่งไปที่ userController
  } catch (error) {
    // return false ; //ย่าบันทึกข้อมูลถ้า ยืนยันอีเมลย์ไม่ได้
    console.log('ขั้นตอนบันทึกรหัส Verify เกิดข้อผิดพลาด ' + error)
  }
}
async function TP_VerifyEmail_Check_Pass(req, res) {
  try {
    const email = req.body.email;
    let updatedData = '';

    const latestData = await getVerifySchema().findOne({ EMAIL: email }).sort({ ID: -1 }).exec(); // เรียงลำดับโดยใช้ ล่าสุด // ID แปรผันตรงกับเวลา
    if (latestData.CODE_VERIFY === req.body.CODE_VERIFY) { //ถ้ายืนยันรหัสใน email ได้
      if (latestData) { //ให้ทำการอัพเดต สถานะการ verify
        const filter = { ID: latestData.ID }; // เรียงลำดับโดยใช้ ล่าสุด // ID แปรผันตรงกับเวลา
        const update = { IS_VERIFY: true }; // อัปเดตสถานะ Verify
        const options = { new: true };
        updatedData = await getVerifySchema().findOneAndUpdate(filter, update, options).exec();
        if (updatedData) {
          res.status(200).json({ status: true, message: 'ยืนยันอีเมลเรียบร้อยแล้ว' });
        } else {
          res.status(500).json({ status: false, message: 'ระบบขัดข้อง ไม่สามารถอัพเดตสถานะ verify ได้' });
        }
      }
    } else {
      res.status(500).json({ status: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    console.error('เกิดการขัดข้อง ', error);
    res.status(500).json({ status: false, message: 'ระบบขัดข้อง กรุณาสมัครสมาชิกอีกครั้ง' });
  }

}

module.exports = { TP_VerifyEmail, getVerifySchema, TP_VerifyEmail_Check_Pass };
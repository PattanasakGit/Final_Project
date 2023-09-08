const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId, getUserBy_Email, listAdmins } = require('../database/Database.js');
const { addLogin } = require('./LoginController');
const { sendEmail } = require('./MailController');
const { TP_VerifyEmail, getVerifySchema } = require('./TP_VerifyEmail.js');

const str_collection = "User"; // collection ใน mongo db

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}
function generateRandomNumber() {
  let randomNumber = '';
  for (let i = 0; i < 6; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return randomNumber;
}
const userSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  U_NAME: { type: String, required: true },
  U_PHONE: { type: String, required: true },
  U_EMAIL: { type: String, required: true },
  U_GENDER: { type: String, required: true },
  ABOUT_ME: { type: String },
  U_IMG: { type: String },
  U_REGISTER: { type: String },
  U_REVIEWS: [
    {
      EMAIL_RW: { type: String },
      RATE: { type: Number },
      COMMENT: { type: String }
    }
  ]
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, userSchema);
function getUserModel() {
  return DataModel;
}

//=========================== เพิ่ม validator ใน Schema===================================

userSchema.path('U_EMAIL').validate(function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}, 'Email ไม่ถูกต้อง');

userSchema.path('U_PHONE').validate(function (phone) {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(phone);
}, 'เบอร์โทรศัพท์ไม่ถูกต้อง');

//=========================== เพิ่ม validator ใน Schema===================================

async function addUser(req, res) {

  async function verify_status_for_check() {
    //ค้นสถานะการ verify โดย การส่ง email เข้าไปค้น
    try {
      const data = await getVerifySchema()
        .findOne({ EMAIL: req.body.U_EMAIL })
        .sort({ ID: -1 }) // เรียงลำดับโดยใช้ ล่าสุด // ID แปรผันตรงกับเวลา
        .exec();
      if (data) {// ถ้าเจอ
        return data.IS_VERIFY; // เก็บค่ารหัสผ่าน
      } else {
        console.log('เกิดข้อผิดพลาดกับการค้นหาสถานะ verify เพื่อบันทึก User');
        return false;
      }
    } catch (error) {
      // กรณีเกิดข้อผิดพลาดในการค้นหา
      console.error('เกิดข้อผิดพลาดกับการค้นหาสถานะ verify เพื่อบันทึก User', error);
      return false;
    }
  }
  try {
    if (await verify_status_for_check()) { // ยืนยันอีเมลย์แล้วค่อยบันทึก
      const user = req.body;
      user.ID = await getNextDataId(DataModel);
      user.U_REGISTER = formatDate(new Date());
      await addLogin(req.body.U_EMAIL, req.body.U_PASSWORD, 'User') // เพิ่ม email และ รหัสผ่านเข้าฐานข้อมูล Login
      await insertData(user, DataModel);

      console.log('การบันทึก User สำเร็จ');
      return res.status(200).json({ status: true, message: 'สมัครสมาชิกเสร็จสิ้น' });
    }
    else if (!await verify_status_for_check()) {
      res.status(500).json({ error: 'การบันทึก User ไม่สำเร็จ' });
    }
    else {
      throw new Error("ระบบขัดข้อง:can't check status verify การบันทึก User ไม่สำเร็จ");
    }

  } catch (error) {
    console.error('Failed to insert user:', error);
    // res.status(500).json({ error: 'Failed to insert user' });
    res.status(500).json({ error: error.message });
  }
}

async function addAdmin(req, res) {
  // ในส่วนของ admin จะสามารถเพิ่มบัญชีได้เลย โดยไม่ต้องทำการ Validate บัญชีก่อน
  try {
    const email = req.body.U_EMAIL;
    const Email_Checked = await DataModel.findOne({ U_EMAIL: email });
    if (Email_Checked !== null) {
      console.log('พบอีเมลซ้ำ --> ' + email);
      throw new Error(`ขออภัย ${email} ถูกใช้งานแล้ว`);
    } else { // ตรวจดูก่อนว่าเคยมี บัญชี Email ซ้ำไหม ไม่มีค่อยบันทึก
      const user = req.body;
      user.ID = await getNextDataId(DataModel);
      user.U_REGISTER = formatDate(new Date());
      await addLogin(req.body.U_EMAIL, req.body.U_PASSWORD, 'Admin') // เพิ่ม email และ รหัสผ่านเข้าฐานข้อมูล Login
      await insertData(user, DataModel);
      console.log('การบันทึก admin สำเร็จ');
      return res.status(200).json({ status: true, message: 'การเพิ่มบัญชีผู้ดูแลระบบสำเร็จ' });
    }

  } catch (error) {
    console.error('Failed to insert user:', error);
    res.status(500).json({ error: error.message });
  }
}

async function User_Verify_Email(req, res) {
  try {
    const Code_verify_Email = generateRandomNumber();
    const email = req.body.U_EMAIL;
    const Email_Checked = await DataModel.findOne({ U_EMAIL: email });

    if (Email_Checked !== null) {
      console.log('พบอีเมลซ้ำ --> ' + email);
      throw new Error(`ขออภัย ${email} ถูกใช้งานแล้ว`);
    } else {
      // เพิ่มข้อมูลเข้าตาราง
      await TP_VerifyEmail(email, Code_verify_Email);
      // ส่งอีเมลยืนยัน
      await sendEmail(Code_verify_Email, email);
      console.log('============================================================');
      res.status(200).json({ status: true, message: `อีเมลถูกสร้างและอยู่ระหว่างการยืนยัน` });
      console.log('============================================================');
    }
  } catch (error) {
    console.error('Failed to insert user:', error);
    res.status(500).json({ error: error.message });
  }
}


async function listUsers(req, res) {
  try {
    const data = await getData(DataModel);

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    res.status(500).json({ error: error.message });
  }
}
async function List_admin(req, res) {
  try {
    const data = await listAdmins(DataModel);
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel);

    console.log('User updated successfully');
    res.status(200).json({ status: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('User deleted successfully');
    res.status(200).json({ status: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await getDataById(id, DataModel);

    if (!user) {
      return res.status(404).json({ error: 'User not found ' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getUserByEmail(req, res) {
  try {
    const { email } = req.body;

    const user = await getUserBy_Email(email, DataModel);

    if (!user) {
      return res.status(404).json({ error: 'User not found ' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    res.status(500).json({ error: error.message });
  }
}

async function addReview(req, res) {
  const data = req.body;
  const userEmail = data.U_EMAIL;

  try {
    const user = await DataModel.findOne({ U_EMAIL: userEmail });

    if (user) {
      // ตรวจสอบว่าเคยรีวิวหรือยัง
      const reviewedByEmail = user.U_REVIEWS.some(review => review.EMAIL_RW === data.EMAIL_RW);

      if (reviewedByEmail) {
        res.status(400).json({ status: false, message: 'คุณได้รีวิวบุคคนนี้ไปแล้ว' });
      } else {

        const newReview = {
          EMAIL_RW: data.EMAIL_RW,
          RATE: data.RATE,
          COMMENT: data.COMMENT
        }
        user.U_REVIEWS.push(newReview);
        await user.save();

        // console.log('เพิ่มรีวิวเรียบร้อยแล้ว');
        res.status(200).json({ status: true, message: 'เพิ่มรีวิวเรียบร้อยแล้ว' });
      }
    } else {
      console.log('ไม่พบผู้ใช้');
      res.status(500).json({ status: false, message: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('User deleted successfully');
    res.status(200).json({ status: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addUser, listUsers, updateUser, deleteUser, getUserById, User_Verify_Email, getUserByEmail, getUserModel, addReview, List_admin, addAdmin };
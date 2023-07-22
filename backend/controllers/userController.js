const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId } = require('../database/Database.js');
const { addLogin, getLoginSchema } = require('./LoginController');
const { sendEmail } = require('./MailController');
const { TP_VerifyEmail, getVerifySchema } = require('./TP_VerifyEmail.js');


const str_collection = "User"; // collection ใน mongo db

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('DD-MM-YYYY HH:mm:ss');
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
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, userSchema);
function getUserModel(){
  return DataModel ;
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
        // console.log('Password:', IS_VERIFY);
      } else {
        console.log('เกิดข้อผิดพลาดกับการค้นหาสถานะ verify เพื่อบันทึก User');
        return false;
      }
    } catch (error) {
      // กรณีเกิดข้อผิดพลาดในการค้นหา
      return false;
      console.error('เกิดข้อผิดพลาดกับการค้นหาสถานะ verify เพื่อบันทึก User', error);
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
      else if (!await verify_status_for_check()){
        res.status(500).json({ error: 'การบันทึก User ไม่สำเร็จ'});
      }
      else{
        throw new Error("ระบบขัดข้อง:can't check status verify การบันทึก User ไม่สำเร็จ");
      }

  } catch (error) {
    console.error('Failed to insert user:', error);
    // res.status(500).json({ error: 'Failed to insert user' });
    res.status(500).json({ error: error.message });
  }
}


// async function User_Verify_Email(req, res) {

//   try {
//     const Code_verify_Email = generateRandomNumber();
//     const Email_Checked = await DataModel.findOne({ U_EMAIL: req.body.U_EMAIL }); //ถ้าพบอีเมลซ้ำจะไม่บันทึก

//     if (Email_Checked !== null) {
//       console.log('พบอีเมลซ้ำ --> ' + req.body.U_EMAIL);
//       throw new Error('ขออภัย ' + req.body.U_EMAIL + ' ถูกใช้งานแล้ว');
//     } 
//     else {
//       await TP_VerifyEmail(req.body.U_EMAIL, Code_verify_Email) //เพิ่มข้อมูลเข้าตาราง
//       await sendEmail(Code_verify_Email, req.body.U_EMAIL); // ส่งอีเมลย์
//       res.status(200).json({ status: true, message: '*-*-*-*-*-*-*-*-*' });

//     }
//   } catch (error) {
//     console.error('Failed to insert user:', error);
//     // res.status(500).json({ error: 'Failed to insert user' });
//     res.status(500).json({ error: error.message });
//   }

// }

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

module.exports = { addUser, listUsers, updateUser, deleteUser, getUserById ,User_Verify_Email, getUserModel};








// async function addUser(req, res) {
//   let TP_createUser = false;

//   async function verify_status_for_check() {
//     let check = false;
//     //ค้นสถานะการ verify โดย การส่ง email เข้าไปค้น
//     try {
//       const data = await getVerifySchema()
//         .findOne({ EMAIL: req.body.U_EMAIL })
//         .sort({ ID: -1 }) // เรียงลำดับโดยใช้ ล่าสุด // ID แปรผันตรงกับเวลา
//         .exec();
//       if (data) {// ถ้าเจอ
//         // return data.IS_VERIFY; // เก็บค่ารหัสผ่าน
//         check = data.IS_VERIFY;
//         // console.log('Password:', IS_VERIFY);
//       } else {
//         console.log('เกิดข้อผิดพลาดกับการค้นหาสถานะ verify เพื่อบันทึก User');
//         // return false;
//         check = false
//       }
//     } catch (error) {
//       // กรณีเกิดข้อผิดพลาดในการค้นหา
//       // return false;
//       check = false
//       console.error('เกิดข้อผิดพลาดกับการค้นหาสถานะ verify เพื่อบันทึก User', error);
//     }
//     return check;
//   }

//   try {
//     const Code_verify_Email = generateRandomNumber();
//     const Email_Checked = await DataModel.findOne({ U_EMAIL: req.body.U_EMAIL }); //ถ้าพบอีเมลซ้ำจะไม่บันทึก

//     if (Email_Checked !== null) {
//       console.log('พบอีเมลซ้ำ --> ' + req.body.U_EMAIL);
//       throw new Error('ขออภัย ' + req.body.U_EMAIL + ' ถูกใช้งานแล้ว');
//     } else {
//       TP_VerifyEmail(req.body.U_EMAIL, Code_verify_Email) //เพิ่มข้อมูลเข้าตาราง
//       sendEmail(Code_verify_Email, req.body.U_EMAIL); // ส่งอีเมลย์

//       // const verrify = getVerifySchema().findOne({ EMAIL: req.body.email }).exec();
//       const VERIFY_Check = await verify_status_for_check();

//       res.status(200).json({ status: true, message: '*-*-*-*-*-*-*-*-*' });
//       TP_createUser = VERIFY_Check;

//       // if (VERIFY_Check) { // ยืนยันอีเมลย์แล้วค่อยบันทึก
        
//         // const user = req.body;
//         // user.ID = await getNextDataId(DataModel);
//         // user.U_REGISTER = formatDate(new Date());
//         // await addLogin(req.body.U_EMAIL, req.body.U_PASSWORD, 'User') // เพิ่ม email และ รหัสผ่านเข้าฐานข้อมูล Login
//         // await insertData(user, DataModel);

//         // console.log('User added successfully');
//         // return res.status(200).json({ status: true, message: 'สมัครสมาชิกเสร็จสิ้น' });
//       // }
//       // else{
//       //   throw new Error('สมัครสมาชิกไม่สำเร็จ');
//       // }




//     }
//   } catch (error) {
//     console.error('Failed to insert user:', error);
//     // res.status(500).json({ error: 'Failed to insert user' });
//     res.status(500).json({ error: error.message });
//   }

//   console.log('================================================================');
//   console.log('================================================================');
//   console.log(TP_createUser);
//   console.log('================================================================');
//   console.log('================================================================');


// if (TP_createUser) {

//   try {
//     const user = req.body;
//     user.ID = await getNextDataId(DataModel);
//     user.U_REGISTER = formatDate(new Date());
//     await addLogin(req.body.U_EMAIL, req.body.U_PASSWORD, 'User') // เพิ่ม email และ รหัสผ่านเข้าฐานข้อมูล Login
//     await insertData(user, DataModel);

//     console.log('User added successfully');
//   res.status(200).json({ status: true, message: 'สมัครสมาชิกเสร็จสิ้น' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
  
// }
const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId } = require('../database/Database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addToken } = require('./Token.js');

var str_collection = "Login";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}
//=================== สำหรับ endCode รหัสผ่าน ================================
const saltRounds = 10;
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};
//===========================================================================

const LoginSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  EMAIL: { type: String },
  PASSWORD: { type: String },
  ROLE: { type: String },
  IS_VERIFY: { type: Boolean }
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, LoginSchema);

function getLoginSchema() {
  return DataModel
}
async function addLogin(email, password, role) {
  try {

    const data = {
      EMAIL: email,
      PASSWORD: await hashPassword(password), // ทำการ Encoded Password
      ROLE: role,
      IS_VERIFY: true

    };

    data.ID = await getNextDataId(DataModel);
    await insertData(data, DataModel);

    console.log('Login added successfully');
    return { status: true, message: 'Login added successfully' };
  } catch (error) {
    console.error('Failed to insert Login:', error);
  }
}


async function listLogins(req, res) {
  try {
    const data = await getData(DataModel);
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve Logins:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateLogin(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel);

    console.log('Login updated successfully');
    res.status(200).json({ status: true, message: 'Login updated successfully' });
  } catch (error) {
    console.error('Failed to update Login:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteLogin(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('Login deleted successfully');
    res.status(200).json({ status: true, message: 'Login deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Login:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getLoginById(req, res) {
  try {
    const { id } = req.params;

    const Login = await getDataById(id, DataModel);
    if (!Login) {
      return res.status(404).json({ error: 'Login not found ' });
    }

    res.status(200).json(Login);
  } catch (error) {
    console.error('Failed to retrieve Login:', error);
    res.status(500).json({ error: error.message });
  }
}

async function resetPass(req, res) {
  const { email, new_password, token, usetoken } = req.body;
  try {

    if (usetoken) {
      // ตรวจสอบและแยก payload จาก JWT เพื่อดึงค่าเวลาหมดอายุของ token
      let decodedToken = "";
      try {
        decodedToken = jwt.decode(token);
      } catch (error) {
        decodedToken = "";
      }
      console.log(decodedToken);

      // ตรวจสอบว่า token ยังคงใช้งานได้หรือไม่
      if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
        return res.status(401).json({ status: false, message: 'Token has expired' });
      }
    }

    // ค้นหาผู้ใช้ด้วยอีเมลล์
    const user = await DataModel.findOne({ EMAIL: email });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
    const new_password_encode = await hashPassword(new_password);
    await DataModel.findByIdAndUpdate(user._id, { PASSWORD: new_password_encode });

    console.log('Password updated successfully');
    res.status(200).json({ status: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to update password:', error);
    res.status(500).json({ error: error.message });
  }
}

// fn สำหรับเข้าสู่ระบบ และ token
async function Login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await DataModel.findOne({ EMAIL: email });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    //===========================  สำหรับ Token ======================================
    const payload = {
      user_id: user._id,
      email: user.EMAIL,
      role: user.ROLE
    };
    // const jwtSecretKey = process.env.JWT_SECRET_KEY || 'TP_KEY';
    const jwtSecretKey = 'TP_KEY_login';
    const token = jwt.sign(payload, jwtSecretKey, {
      expiresIn: '1h', // กำหนดเวลาหมดอายุของ token
    });
    //===============================================================================

    // สร้าง JWT (หากต้องการ) และส่งคืนข้อมูลให้กับ frontend
    addToken(token, email, user.ROLE);
    return res.status(200).json({ status: true, message: 'เข้าสู่ระบบสำเร็จ', token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
module.exports = { addLogin, listLogins, updateLogin, deleteLogin, getLoginById, getLoginSchema, Login, resetPass };

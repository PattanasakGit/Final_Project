const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId } = require('../database/Database.js');
var str_collection = "User";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('DD-MM-YYYY HH:mm:ss');
  return formattedDate;
}

const userSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  U_NAME: { type: String, required: true },
  U_PHONE: { type: String, required: true },
  U_EMAIL: { type: String, required: true },
  U_GENDER: { type: String, required: true},
  ABOUT_ME: { type: String },
  U_IMG: { type: String },
  U_REGISTER: { type: String },
  
  //ลองข้อมูลที่ เก็บรหัสไว้กับตัวบุคคน
  U_PASSWORD: { type: String, required: true},
  U_ROLE: { type: String }
}, { versionKey: false });

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

const DataModel = mongoose.model(str_collection, userSchema);

async function addUser(req, res) {
  try {
    const user = req.body;
    user.ID = await getNextDataId(DataModel);
    user.U_REGISTER = formatDate(new Date());
    user.U_ROLE = 'User';

    await insertData(user, DataModel);

    console.log('User added successfully');
    res.status(200).json({status : true , message: 'User added successfully' });
  } catch (error) {
    console.error('Failed to insert user:', error);
    // res.status(500).json({ error: 'Failed to insert user' });
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
    res.status(200).json({status : true , message: 'User updated successfully' });
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
    res.status(200).json({status : true , message: 'User deleted successfully' });
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

module.exports = { addUser, listUsers, updateUser, deleteUser, getUserById };
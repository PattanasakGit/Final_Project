const mongoose = require('mongoose');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextUserId } = require('../database/Database.js');
var str_collection = "tests";

const userSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  name: { type: String},
  email: {type: String}
},{versionKey: false});

const DataModel = mongoose.model(str_collection, userSchema);

async function addUser(req, res) {
  try {
    const user = req.body;
    user.ID = await getNextUserId(DataModel);

    await insertData(user, DataModel); // เพิ่มผู้ใช้ในฐานข้อมูล

    console.log('User added successfully');
    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Failed to insert user:', error);
    res.status(500).json({ error: 'Failed to insert user' });
  }
}


async function listUsers(req, res) {
  try {
    const data = await getData(DataModel); // ดึงข้อมูลผู้ใช้จากฐานข้อมูล

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel); // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล

    console.log('User updated successfully');
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel); // ลบข้อมูลผู้ใช้จากฐานข้อมูล

    console.log('User deleted successfully');
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    
    const user = await getDataById(id, DataModel); // ค้นหาข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ ID

    if (!user) {
      return res.status(404).json({ error: 'User not found '});
    }
 
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
}

module.exports = { addUser, listUsers, updateUser, deleteUser, getUserById };

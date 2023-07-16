const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "Login";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('DD-MM-YYYY HH:mm:ss');
  return formattedDate;
}

const LoginSchema = new Schema({
    ID: { type: Number, required: true, unique: true },
    EMAIL: { type: String },
    PASSWORD: { type: String },
    ROLE: { type: String }
  }, { versionKey: false });

const DataModel = mongoose.model(str_collection, LoginSchema);

async function addLogin(req, res) {
  try {
    const Login = req.body;
    Login.ID = await getNextDataId(DataModel);

    await insertData(Login, DataModel); 

    console.log('Login added successfully');
    res.status(200).json({ message: 'Login added successfully' });
  } catch (error) {
    console.error('Failed to insert Login:', error);
    res.status(500).json({ error: error.message });
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
    res.status(200).json({ message: 'Login updated successfully' });
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
    res.status(200).json({ message: 'Login deleted successfully' });
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
      return res.status(404).json({ error: 'Login not found '});
    }
 
    res.status(200).json(Login);
  } catch (error) {
    console.error('Failed to retrieve Login:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addLogin, listLogins, updateLogin, deleteLogin, getLoginById };

const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById,getNextDataId } = require('../database/Database.js');
var str_collection = "Role";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}

const RoleSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  R_NAME: { type: String },
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, RoleSchema);

async function addRole(req, res) {
  try {
    const Role = req.body;
    Role.ID = await getNextDataId(DataModel);

    await insertData(Role, DataModel); 

    console.log('Role added successfully');
    res.status(200).json({ status : true ,   message: 'Role added successfully' });
  } catch (error) {
    console.error('Failed to insert Role:', error);
    res.status(500).json({ error: error.message });
  }
}

async function listRoles(req, res) {
  try {
    const data = await getData(DataModel); 
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve Roles:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel); 

    console.log('Role updated successfully');
    res.status(200).json({ status : true ,   message: 'Role updated successfully' });
  } catch (error) {
    console.error('Failed to update Role:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteRole(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('Role deleted successfully');
    res.status(200).json({ status : true ,   message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Role:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getRoleById(req, res) {
  try {
    const { id } = req.params;
    
    const Role = await getDataById(id, DataModel); 
    if (!Role) {
      return res.status(404).json({ error: 'Role not found '});
    }
 
    res.status(200).json(Role);
  } catch (error) {
    console.error('Failed to retrieve Role:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addRole, listRoles, updateRole, deleteRole, getRoleById };

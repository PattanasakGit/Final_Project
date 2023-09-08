const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId } = require('../database/Database.js');
var str_collection = "CategoryProduct";

function formatDate(date) {
  const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
  return formattedDate;
}

const CategoryProductSchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  CP_NAME: { type: String },
  CP_ICON: { type: String }
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, CategoryProductSchema);

async function addCategoryProduct(req, res) {
  try {
    const CategoryProduct = req.body;
    CategoryProduct.ID = await getNextDataId(DataModel);

    await insertData(CategoryProduct, DataModel);
    console.log('CategoryProduct added successfully');
    res.status(200).json({ status: true, message: 'CategoryProduct added successfully' });
  } catch (error) {
    console.error('Failed to insert CategoryProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

async function listCategoryProducts(req, res) {
  try {
    const data = await getData(DataModel);

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to retrieve CategoryProducts:', error);
    res.status(500).json({ error: error.message });
  }
}

async function updateCategoryProduct(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    await updateData(id, newData, DataModel);
    console.log('CategoryProduct updated successfully');
    res.status(200).json({ status: true, message: 'CategoryProduct updated successfully' });
  } catch (error) {
    console.error('Failed to update CategoryProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteCategoryProduct(req, res) {
  try {
    const { id } = req.params;

    await deleteData(id, DataModel);

    console.log('CategoryProduct deleted successfully');
    res.status(200).json({ status: true, message: 'CategoryProduct deleted successfully' });
  } catch (error) {
    console.error('Failed to delete CategoryProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getCategoryProductById(req, res) {
  try {
    const { id } = req.params;

    const CategoryProduct = await getDataById(id, DataModel);

    if (!CategoryProduct) {
      return res.status(404).json({ error: 'CategoryProduct not found ' });
    }

    res.status(200).json(CategoryProduct);
  } catch (error) {
    console.error('Failed to retrieve CategoryProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addCategoryProduct, listCategoryProducts, updateCategoryProduct, deleteCategoryProduct, getCategoryProductById };

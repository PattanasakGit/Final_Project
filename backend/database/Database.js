const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/Final_Project';

async function connectDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

async function closeDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Failed to close database connection:', error);
    throw error;
  }
}

async function insertData(data, DataModel) {
  try {
    const user = new DataModel(data);
    const result = await user.save();

    console.log('Data added successfully:', result);
  } catch (error) {
    console.error('Failed to insert data:', error);
    throw error;
  }
}

async function getData(DataModel) {
  try {
    const data = await DataModel.find({}).exec();
    return data;
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    throw error;
  }
}

async function updateData(id, newData, DataModel) {
  try {
    const result = await DataModel.updateOne({ ID: id }, { $set: newData }).exec();
    console.log('Data updated successfully:', result);
  } catch (error) {
    console.error('Failed to update Data:', error);
    throw error;
  }
}

async function deleteData(id, DataModel) {
  try {
    const result = await DataModel.deleteOne({ ID: id }).exec();
    console.log('Data deleted successfully:', result);
  } catch (error) {
    console.error('Failed to delete Data:', error);
    throw error;
  }
}

async function getDataById(id, DataModel) {
  
  try {
    const data = await DataModel.findOne({ ID: id }).exec();
    return data;
  } catch (error) {
    console.error('Failed to retrieve Data:', error);
    throw error;
  }
}

async function listAdmins(DataModel) {
  try {
    const admins = await DataModel.aggregate([
      {
        $lookup: {
          from: "logins",
          localField: "U_EMAIL", 
          foreignField: "EMAIL",
          as: "userLogins" 
        }
      },
      {
        $unwind: "$userLogins"
      },
      {
        $match: {
          "userLogins.ROLE": "Admin"
        }
      },
      {
        $project: {
          ID: 1,
          U_NAME: 1,
          U_PHONE: 1,
          U_EMAIL: 1,
          U_GENDER: 1,
          ABOUT_ME: 1,
          U_IMG: 1,
          U_REGISTER: 1,
          "userLogins.ID": 1
        }
      }
    ]).exec();

    return admins;
  } catch (error) {
    console.error('Failed to retrieve admin data:', error);
    throw error;
  }
}

async function getUserBy_Email(email, DataModel) {
  try {
    const data = await DataModel.findOne({ U_EMAIL: email }).exec();
    return data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการ Get User By Email', error);
    throw error;
  }
}

async function getNextDataId(DataModel) {
  try {
    const data = await DataModel.find().sort({ ID: -1 }).limit(1).exec();
    const maxUserId = data.length > 0 ? data[0].ID : 0;
    return maxUserId + 1;
  } catch (error) {
    console.error('Failed to get next user id:', error);
    throw error;
  }
}
//-------------------------------------------------------------------------------------
async function getToken_check(Token, DataModel) {
  try {
    const data = await DataModel.findOne({ Token: Token }).exec();
    return data;
  } catch (error) {
    console.error('Failed to retrieve Data:', error);
    throw error;
  }
}



module.exports = {
  connectDatabase,
  closeDatabase,
  insertData,
  getData,
  updateData,
  deleteData,
  getDataById,
  getNextDataId,
  getToken_check,
  getUserBy_Email,
  listAdmins
};

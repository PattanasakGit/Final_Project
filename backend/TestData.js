const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/Final_Project';
var { getVerifySchema } = require('../backend/controllers/TP_VerifyEmail.js');
var { getUserModel } = require('./controllers/userController.js');

async function connectToDatabase() {
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

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Failed to close database connection:', error);
    throw error;
  }
}

// async function TestFindOne() {
//   try {
//     await connectToDatabase();
//     const email = "pattanasakaattagun@gmail.com" ;

//     const latestData = await getVerifySchema().findOne({ EMAIL: email }).sort({ ID: -1 }).exec();
//     let updatedData ='';
//     if (latestData) {
//       const filter = { ID : latestData.ID }; // ใช้ _id ของเอกสารที่ค้นหาเจอในการอัปเดต
//       const update = { IS_VERIFY: true }; // อัปเดตสถานะ Verify
//       const options = { new: true };
//       updatedData = await getVerifySchema().findOneAndUpdate(filter, update, options).exec();
//         if (updatedData) { // อัปเดตสำเร็จ
//             console.log('✅ อัปเดตสำเร็จ ✅');
//         } else { // ค้นหาแล้วไม่ตรงกับเงื่อนไขค้นหา
//             console.log(' อัปเดตwไม่สำเร็จ');
//         }
//     }
//     console.log('================================');
//     console.log(updatedData);
//     console.log('================================');

//     await disconnectFromDatabase();
//   } catch (error) {
//     console.error(error);
//   }
// }

// TestFindOne();





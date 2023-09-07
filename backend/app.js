const express = require('express');
var cors = require('cors');
const app = express();
const port = 8000;

const { Token } = require('./controllers/Token');
const { connectDatabase, closeDatabase } = require('./database/Database.js');
const { TP_VerifyEmail_Check_Pass } = require('./controllers/TP_VerifyEmail');
const { changePassword, Every_Email} = require('./controllers/MailController');
const { Login, resetPass, deleteLogin } = require('./controllers/LoginController');
const { addDataWeb, listDataWebs, updateDataWeb, deleteDataWeb, getDataWebById } = require('./controllers/datawebController');
const { addTopBanner, listTopBanners, updateTopBanner, deleteTopBanner, getTopBannerById } = require('./controllers/TopBannerController');
const { addAdvert, listAdverts, updateAdvert, deleteAdvert, getAdvertById, getAdvertByProduct } = require('./controllers/AdvertController');
const { addSideBanner, listSideBanners, updateSideBanner, deleteSideBanner, getSideBannerById } = require('./controllers/SideBannerController');
const { addFRAUD_REPORT, listFRAUD_REPORT, updateFRAUD_REPORT, deleteFRAUD_REPORT, getFRAUD_REPORT_Id } = require('./controllers/Fraud_Report');
const { addCategoryProduct, listCategoryProducts, updateCategoryProduct, deleteCategoryProduct, getCategoryProductById } = require('./controllers/CategoryProductController');
const { addUser, listUsers, updateUser, deleteUser, getUserById, getUserByEmail, User_Verify_Email, addReview, List_admin, addAdmin } = require('./controllers/userController');
const { addProduct, listProducts, updateProduct, deleteProduct, getProductById,  getProductByName, getProductByCATEGORY, getProductTYPE ,getProductByMultipleConditions, ListProduct_for_one_user,updateProductByAdmin} = require('./controllers/productController');

app.use(express.json());
app.use(cors());

// System API
app.post('/Every_Email', Every_Email); //ส่ง email โดยจะรับค่าต่างผ่าน body
app.post('/sendEmaiChangePassword/:email', changePassword); //เมื่อใช้จะทำการส่ง email เพิ่มขอเปลี่ยนรหัสผ่าน
app.put('/resetPass', resetPass); //เอาข้อมูลใหม่มา อัพเดต
app.get('/Check_Token', Token); //ตรวจสอบ Token ว่าใช้ได้อยู่ไหม
app.post('/TP_VerifyEmail', TP_VerifyEmail_Check_Pass); //ตรวจสอบรหัส Verify ที่ส่งไปยัง mail
app.post('/User_Verify_Email', User_Verify_Email);
app.post('/Login', Login); 
app.delete('/deleteLogin/:id', deleteLogin); 
// User API
app.post('/addReview', addReview);
app.post('/createUser', addUser);
app.post('/getUserByEmail', getUserByEmail);
app.put('/updateUser/:id', updateUser);
app.delete('/deleteUser/:id', deleteUser);
app.get('/getUser/:id', getUserById);
app.get('/listUsers', listUsers)
app.get('/List_admin', List_admin)
app.post('/createAdmin', addAdmin);
//Product API
app.post('/ListProductByUser', ListProduct_for_one_user);
app.post('/createProduct', addProduct);
app.put('/updateProduct/:id', updateProduct);
app.put('/updateProductByAdmin/:id', updateProductByAdmin);
app.delete('/deleteProduct/:id', deleteProduct);
app.get('/getProduct/:id', getProductById);
app.get('/listProduct', listProducts)
// For Search Product
app.get('/getProductName/:Name', getProductByName);
app.get('/getProductByCATEGORY/:C', getProductByCATEGORY);
app.get('/getProductTYPE/:T', getProductTYPE);
app.post('/getProductByMultipleConditions',getProductByMultipleConditions);
//Dataweb API
app.post('/createDataWeb', addDataWeb);
app.put('/updateDataWeb/:id', updateDataWeb);
app.delete('/deleteDataWeb/:id', deleteDataWeb);
app.get('/getDataWeb/:id', getDataWebById);
app.get('/listDataWeb', listDataWebs)
//Advertisement API
app.post('/createAdvert', addAdvert);
app.put('/updateAdvert/:id', updateAdvert);
app.delete('/deleteAdvert/:id', deleteAdvert);
app.get('/getAdvert/:id', getAdvertById);
app.get('/getAdvertByProduct/:id', getAdvertByProduct);
app.get('/listAdvert', listAdverts)
//CategoryProduct
app.post('/createCategoryProduct', addCategoryProduct);
app.put('/updateCategoryProduct/:id', updateCategoryProduct);
app.delete('/deleteCategoryProduct/:id', deleteCategoryProduct);
app.get('/getCategoryProduct/:id', getCategoryProductById);
app.get('/listCategoryProduct', listCategoryProducts)
//SideBanner
app.post('/createSideBanner', addSideBanner);
app.put('/updateSideBanner/:id', updateSideBanner);
app.delete('/deleteSideBanner/:id', deleteSideBanner);
app.get('/getSideBanner/:id', getSideBannerById);
app.get('/listSideBanner', listSideBanners)
//TopBanner
app.post('/createTopBanner', addTopBanner);
app.put('/updateTopBanner/:id', updateTopBanner);
app.delete('/deleteTopBanner/:id', deleteTopBanner);
app.get('/getTopBanner/:id', getTopBannerById);
app.get('/listTopBanner', listTopBanners)

//fraud report
app.post('/addFRAUD_REPORT', addFRAUD_REPORT);
app.put('/updateFRAUD_REPORT/:id', updateFRAUD_REPORT);
app.delete('/deleteFRAUD_REPORT/:id', deleteFRAUD_REPORT);
app.get('/getFRAUD_REPORT_Id/:id', getFRAUD_REPORT_Id);
app.get('/listFRAUD_REPORT', listFRAUD_REPORT)

// Middleware สำหรับจัดการข้อผิดพลาดในรูปแบบ JSON response
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errorMessage = err.message.replace('User validation failed: ', '');
    res.status(500).json({ error: "Test failed" });
  } else {
    res.status(500).json({ error: "Test failed" });
  }
});

const startServer = async () => {
  try {
    await connectDatabase(); // เชื่อมต่อฐานข้อมูล

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // ปิดการเชื่อมต่อกับ MongoDB เมื่อปิดแอปพลิเคชัน
    process.on('SIGTERM', async () => {
      await closeDatabase(); // ปิดการเชื่อมต่อฐานข้อมูล
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    // จัดการกับการปิดโปรแกรมด้วย Ctrl+C
    process.on('SIGINT', async () => {
      await closeDatabase(); // ปิดการเชื่อมต่อฐานข้อมูล
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();



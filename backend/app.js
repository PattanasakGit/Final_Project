const express = require('express');
var cors = require('cors');
const app = express();
const port = 8000;
const { Login } = require('./controllers/LoginController');
const { connectDatabase, closeDatabase } = require('./database/Database.js');
const { TP_VerifyEmail_Check_Pass } = require('./controllers/TP_VerifyEmail');
const { addAdvert, listAdverts, updateAdvert, deleteAdvert, getAdvertById } = require('./controllers/AdvertController');
const { addDataWeb, listDataWebs, updateDataWeb, deleteDataWeb, getDataWebById } = require('./controllers/datawebController');
const { addUser, listUsers, updateUser, deleteUser, getUserById, User_Verify_Email } = require('./controllers/userController');
const { addTopBanner, listTopBanners, updateTopBanner, deleteTopBanner, getTopBannerById } = require('./controllers/TopBannerController');
const { addSideBanner, listSideBanners, updateSideBanner, deleteSideBanner, getSideBannerById } = require('./controllers/SideBannerController');
const { addStatusProduct, listStatusProducts, updateStatusProduct, deleteStatusProduct, getStatusProductById } = require('./controllers/StatusProductController');
const { addCategoryProduct, listCategoryProducts, updateCategoryProduct, deleteCategoryProduct, getCategoryProductById } = require('./controllers/CategoryProductController');
const { addProduct, listProducts, updateProduct, deleteProduct, getProductById,  getProductByName, getProductByCATEGORY, getProductTYPE ,getProductByMultipleConditions} = require('./controllers/productController');

app.use(express.json());
app.use(cors());

app.post('/Login', Login);
app.post('/TP_VerifyEmail', TP_VerifyEmail_Check_Pass);
app.post('/User_Verify_Email', User_Verify_Email);
// User API
app.post('/createUser', addUser);
app.put('/updateUser/:id', updateUser);
app.delete('/deleteUser/:id', deleteUser);
app.get('/getUser/:id', getUserById);
app.get('/listUsers', listUsers)
//Product API
app.post('/createProduct', addProduct);
app.put('/updateProduct/:id', updateProduct);
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
app.get('/listSideBanner', listSideBanners)
//StatusProduct
app.post('/createStatusProduct', addStatusProduct);
app.put('/updateStatusProduct/:id', updateStatusProduct);
app.delete('/deleteStatusProduct/:id', deleteStatusProduct);
app.get('/getStatusProduct/:id', getStatusProductById);
app.get('/listStatusProduct', listStatusProducts)


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



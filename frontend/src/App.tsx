import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/system/Login.tsx'
import CreateUser from './component/CreateUser.tsx'
import NavBar from "./component/system/NavBar.tsx";
import Footer from "./component/system/Footer.tsx";
import Home from "./component/Home.tsx";
import Product from "./component/Product.tsx";
import CreateProduct from "./component/CreateProduct.tsx";
import FileUpload from './component/Test2.tsx'
import MyProfile from "./component/MyProfile.tsx";
import { ResetPasswordPage, ResetPasswordPage_canLogin } from "./component/system/NewPassword.tsx";
import ForgetPassword from "./component/system/foget_password.tsx"
import MyProduct from "./component/MyProduct.tsx";
import EditProduct from "./component/EditProduct.tsx";
import Shop from "./component/Shop.tsx";
import Advert from "./component/Advert.tsx"
// นำเข้า หน้าต่าง ๆ ที่เป็นของ admin
import AdminHome from "./component/Admin/AdminHome.tsx"
import AdminManagement from "./component/Admin/AdminManagement.tsx"
import AdminCheckProduct from "./component/Admin/AdminCheckProduct.tsx"
import AdminCheckAds from "./component/Admin/AdminCheckAds.tsx"
import AdminCategory from "./component/Admin/AdminCategory.tsx"
import AdminTopBanner from "./component/Admin/AdminBanner.tsx"
import DataWeb from "./component/Admin/DataWeb.tsx"
import TestPage from "./component/Test2.tsx"
import FraudReport from "./component/FraudReport.tsx"
import './App.css'
import { getDataWeb } from "./component/system/HTTP_Request .tsx";
import { useEffect } from "react";

function App() {
  const role: string | null = localStorage.getItem('role'); // ควนรจาก LS


  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/test" element={<TestPage />} /> */}
          {role !== 'User' && role !== 'Admin' && (
            <>
              <Route path="/" element={<Login />} />
            </>
          )}
          {role === 'User' && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/EditProduct/:id" element={<EditProduct />} />
              {/* <Route path="/MyProduct" element={<MyProduct />} /> */}
            </>
          )}
          {role === 'Admin' && (
            <>

              <Route path="/" element={<AdminHome />} />
              <Route path="/AdminManagement" element={<AdminManagement />} />
              <Route path="/AdminCheckProduct" element={<AdminCheckProduct />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/AdminCheckAds" element={<AdminCheckAds />} />
              <Route path="/AdminCategory" element={<AdminCategory />} />
              <Route path="/AdminTopBanner" element={<AdminTopBanner />} />
              <Route path="/DataWeb" element={<DataWeb />} />

            </>
          )}

          <Route path="/" element={<Home />} />
          <Route path="/FraudReport" element={<FraudReport />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/Advert" element={<Advert />} />
          <Route path="/CreateProduct" element={<CreateProduct />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/ChangePassword" element={<ResetPasswordPage_canLogin />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/Product/:id" element={<Product />} />
          <Route path="/forget_password" element={<ForgetPassword />} />
          <Route path="/MyProduct" element={<MyProduct />} />


        </Routes>
      </BrowserRouter>
      <Footer />
    </>

  )
}

export default App

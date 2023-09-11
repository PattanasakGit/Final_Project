import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
// นำเข้า หน้าต่าง ๆ ที่เป็นของ Web System
import Login from './component/WebSystem/Login.tsx';
import NavBar from "./component/WebSystem/NavBar.tsx";
import Footer from "./component/WebSystem/Footer.tsx";
import PrivacyPolicy from "./component/WebSystem/PrivacyPolicy.tsx"
import ForgetPassword from "./component/WebSystem/foget_password.tsx"
import { ResetPasswordPage, ResetPasswordPage_canLogin } from "./component/WebSystem/NewPassword.tsx";
// นำเข้า หน้าต่าง ๆ ที่เป็นของ User
import Home from "./component/User/Home.tsx";
import Shop from "./component/User/Shop.tsx";
import Advert from "./component/User/Advert.tsx"
import Product from "./component/User/Product.tsx";
import MyProduct from "./component/User/MyProduct.tsx";
import MyProfile from "./component/User/MyProfile.tsx";
import CreateUser from './component/User/CreateUser.tsx'
import FraudReport from "./component/User/FraudReport.tsx"
import EditProduct from "./component/User/EditProduct.tsx";
import CreateProduct from "./component/User/CreateProduct.tsx";
// นำเข้า หน้าต่าง ๆ ที่เป็นของ admin
import AdminHome from "./component/Admin/AdminHome.tsx"
import DataWeb from "./component/Admin/AdminUpdateDataWeb.tsx"
import AdminTopBanner from "./component/Admin/AdminBanner.tsx"
import AdminCategory from "./component/Admin/AdminCategory.tsx"
import AdminCheckAds from "./component/Admin/AdminCheckAds.tsx"
import AdminManagement from "./component/Admin/AdminManagement.tsx"
import AdminCheckProduct from "./component/Admin/AdminCheckProduct.tsx"
import CheckFraudReport from "./component/Admin/AdminCheckFraudReport.tsx"

function App() {
  const role: string | null = localStorage.getItem('role'); // ควนรจาก LS
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          {role !== 'User' && role !== 'Admin' && (
              <Route path="/" element={<Login />} />
          )}
          {role === 'User' && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/MyProfile" element={<MyProfile />} />
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
              <Route path="/HomePage" element={<Home />} />
              <Route path="/CheckFraudReport" element={<CheckFraudReport />} />
            </>
          )}

          <Route path="/" element={<Home />} />
          <Route path="/EditProduct/:id" element={<EditProduct />} />
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
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}
export default App
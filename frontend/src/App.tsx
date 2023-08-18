import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/system/Login.tsx'
import CreateUser from './component/CreateUser.tsx'
import NavBar from "./component/system/NavBar.tsx";
import Footer from "./component/Footer.tsx";
import Home from "./component/Home.tsx";
import Product from "./component/Product.tsx";
import CreateProduct from "./component/CreateProduct.tsx";
import FileUpload from './component/Test2.tsx'
import MyProfile from "./component/MyProfile.tsx";
import {ResetPasswordPage,ResetPasswordPage_canLogin} from "./component/system/NewPassword.tsx";
import ForgetPassword from "./component/system/foget_password.tsx"
import MyProduct from "./component/MyProduct.tsx";
import EditProduct from "./component/EditProduct.tsx";
import Shop from "./component/Shop.tsx";
import Advert from "./component/Advert.tsx"
// import { Check_Token } from './component/HTTP_Request .tsx';

import './App.css'


function App() {
  // ตรวจสอบ token และข้อมูล EMAIL และ ROLE
  // const tokenData = await Check_Token();
  // const email = tokenData.EMAIL;
  // const role = tokenData.ROLE;

  const role: string | null = localStorage.getItem('role'); // ควนรจาก LS

  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/test" element={<FileUpload />} />
          {role === 'User' && (
            <>
             
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/EditProduct/:id" element={<EditProduct />} />
              {/* <Route path="/MyProduct" element={<MyProduct />} /> */}
            </>
          )}
          {role === 'Admin' && (
            <>
              <Route path="/MyProfile" element={<MyProfile />} />
            </>
          )}
          <Route path="/" element={<Home />} />
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

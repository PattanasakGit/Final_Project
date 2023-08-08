import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/system/Login.tsx'
import CreateUser from './component/CreateUser.tsx'
import NavBar from "./component/NavBar.tsx";
import Footer from "./component/Footer.tsx";
import Home from "./component/Home.tsx";
import Product from "./component/Product.tsx";
import CreateProduct from "./component/CreateProduct.tsx";
import FileUpload from './component/Test2.tsx'
import MyProfile from "./component/MyProfile.tsx";
import ResetPasswordPage from "./component/system/NewPassword.tsx";
import ForgetPassword from "./component/system/foget_password.tsx"
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
              <Route path="/CreateProduct" element={<CreateProduct />} />
              <Route path="/MyProfile" element={<MyProfile />} />
            </>
          )}
          {role === 'Admin' && (
            <>
              <Route path="/MyProfile" element={<MyProfile />} />
            </>
          )}
          <Route path="/" element={<Home />} />

          <Route path="/resetPassword" element={<ResetPasswordPage />} />

          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/Product/:id" element={<Product />} />
          <Route path="/forget_password" element={<ForgetPassword />} />


        </Routes>
      </BrowserRouter>
      <Footer />
    </>

  )
}

export default App

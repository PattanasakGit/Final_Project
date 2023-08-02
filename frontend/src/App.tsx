import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/Login.tsx'
import CreateUser from './component/CreateUser.tsx'
import NavBar from "./component/NavBar.tsx";
import Footer from "./component/Footer.tsx";
import Home from "./component/Home.tsx";
import Product from "./component/Product.tsx";
import CreateProduct from "./component/CreateProduct.tsx";
import  FileUpload  from './component/Test2.tsx'

import './App.css'

function App() {

  return (
    <>
    <NavBar/>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />}/>
          <Route path="/" element={<Home />}/>
          <Route path="/test" element={<FileUpload />}/>
          <Route path="/CreateUser" element={<CreateUser />}/>
          <Route path="/Product/:id" element={<Product />}/>
          <Route path="/CreateProduct" element={<CreateProduct />}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </>
  )
}

export default App

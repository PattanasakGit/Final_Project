import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/Login.tsx'
import CreateUser from './component/CreateUser.tsx'
import NavBar from "./component/NavBar.tsx";
import Footer from "./component/Footer.tsx";
import Home from "./component/Home.tsx";
import './App.css'

function App() {

  return (
    <>
    <NavBar/>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />}/>
          <Route path="/Home" element={<Home />}/>
          <Route path="/CreateUser" element={<CreateUser />}/>
        </Routes>
      </BrowserRouter>
      {/* <Footer/> */}
    </>
  )
}

export default App

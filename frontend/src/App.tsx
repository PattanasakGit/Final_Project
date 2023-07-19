import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/Login.tsx'
import CreateUser from './component/CreateUser.tsx'
import NavBar from "./component/NavBar.tsx";
import Footer from "./component/Footer.tsx";
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />}> */}
        <Route path="/" element={<CreateUser/>}>
        
        </Route>
      </Routes>
    </BrowserRouter>
    {/* <Footer/> */}
  </> 
  )
}

export default App

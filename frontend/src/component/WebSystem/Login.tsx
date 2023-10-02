import { useState } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import { submitLogin } from "./HTTP_Request ";
// import Swal from 'sweetalert2'

const PortFrontend = import.meta.env.VITE_URL_FRONTEND

function Login() {
  localStorage.clear();
  sessionStorage.clear();
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');
  // const [checked, setChecked] = useState(true);
  
  // useEffect(() => {
  //   setChecked(true);
  // }, []);

  let data = {
    email: emailInput,
    password: passwordInput,
    role: 'User'
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
  };

  const handleClick = (): void => {
    submitLogin(data, 'Login')
  };

  // const aleart_Demo = () => {
  //   if(checked){
  //     Swal.fire({
  //       html:
  //         `
  //         <style>
  //           @media (max-width: 767px) {
  //             h1 {font-size: 18px;}
  //             h2 {font-size: 16px;}
  //             h3 {font-size: 14px;}
  //             img {height:200px !important;}
  //           }
  //         </style>
  //         <center>
  //             <h1>โปรดทราบ</h1>
  //             <h2>เว็ปไซต์ที่คุณกำลังใช้งานเป็นเวอร์ชั่น <span style="color: red;">ทดลองใช้งานก่อนเปิดใช้งานจริง</span></h2>
  //             <h3> ข้อมูลที่อยู่ในระบบตอนทดสอบ จะอยู่ในระบบเมื่อเว็ปไซต์ใช้งานจริง รวมถึงรายการประกาศขายของคุณจะถูกประกาศขายจริงด้วย
  //             <br/> โปรดแจ้งผู้พัฒนา หากคุณต้องการลบข้อมูลการทดสอบทั้งหมด เราจะแจ้งให้คุณทราบก่อนจะเปลี่ยนแปลงจากเวอร์ชันทดลองใช้สู่เว็ปไซต์จริง </h3>
  //             <h3 style="margin: 0; background-color:#F8F0E5;">หากคุณพบ ข้อผิดพลาดในระบบ 
  //             <br/> หรือต้องการเสนอแนะการปรับปรุงแก้ไข 
  //             <br/> โปรดติดต่อ : <a href='https://www.facebook.com/Pattanasak.Atakul'> Pattanasak Atakul </a>(ผู้พัฒนา)</h3>
  //             <img style="height:400px; border-radius: 15px;" src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FsendMessege.jpg?alt=media&token=9cd19af8-1813-41ad-a648-1594add57ada'>
  //         <center>
  //           `,
  //       showConfirmButton: true,
  //       showCancelButton: true,
  //       width: '95%',
  //     })
  //     setChecked(false);
  //   }
  // }

  return (
    <>
      {/* {aleart_Demo()} */}
      <div className='backgroundLogin'>
        <div>
          <div className="Login_Container">
            <form name="form1" className="box_login" onSubmit={handleFormSubmit}>
              <h4>
                YakKai
              </h4>
              <h5>โปรดเข้าสู่ระบบ</h5>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                value={emailInput}
                onChange={(event) => setEmail(event.target.value.toLowerCase())}
              />
              <i className="typcn typcn-eye" onClick={togglePasswordVisibility} id="eye"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password" name="password"
                placeholder="Password"
                autoComplete="off"
                value={passwordInput}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div className="containercheckbox">
                <div className="checkbox-containercheckbox">
                  <label htmlFor="showPassword" className="checkbox">
                    <input
                      type="checkbox"
                      id="showPassword"
                      name="showPassword"
                      checked={showPassword}
                      onChange={togglePasswordVisibility}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="text-containercheckbox" style={{ marginLeft: '10px', color: '#333' }}>แสดงรหัสผ่าน</div>
                <div className="link-containercheckbox">
                  <a href={PortFrontend + "/forget_password"} className="forgetpass">
                    ลืมรหัสผ่าน?
                  </a>
                </div>
              </div>
              <div className='cover_btn1_login'>
                <input type="submit" value="Sign in" onClick={handleClick} className="btn1" />
              </div>
            </form>
            <div className='cover_btn1_login'>
              <a href={PortFrontend + "/CreateUser"} className="dnthave"> ยังไม่มีบัญชีใช่ไหม สมัครสมาชิกใหม่ </a>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
export default Login;

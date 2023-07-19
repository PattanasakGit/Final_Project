import { useState } from 'react';
import '../css/login.css';
import '../css/checkbox.css';
// import submit from '../component/FetchData';
import { submit } from "./FetchData";
const Path = 'Login';


function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');

  let data = {
    EMAIL : emailInput,
    PASSWORD : passwordInput,
    ROLE:'User'
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = (event: any) => {
    event.preventDefault();

    console.log(emailInput);
    console.log(passwordInput);
    setErrorMessage(emailInput)

  };

  const handleClick = (): void => {
    submit(data,Path)
  };



  return (

    <div className="App">
      <div className="animated bounceInDown">
        <div className="container">
          <span className="error animated tada" id="msg">
            {errorMessage}
          </span>
          <form name="form1" className="box" onSubmit={handleFormSubmit}>
            <h4>
              Yakkkai<span>.com</span>
            </h4>
            <h5>โปรดเข้าสู่ระบบ</h5>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              value={emailInput}
              onChange={(event) => setEmail(event.target.value)}
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
              <div className="text-containercheckbox">แสดงรหัสผ่าน</div>
              <div className="link-containercheckbox">
                <a href="www.google.co.th" className="forgetpass">
                  Forget Password?
                </a>
              </div>
            </div>
            <input 
              type="submit" 
              value="Sign in" 
              onClick={handleClick}
              className="btn1" />
          </form>
          <a href="#" className="dnthave">
            Don’t have an account? Sign up
          </a>
        </div>
        <div className="footer"></div>
      </div>
    </div>

  );

}

export default Login;

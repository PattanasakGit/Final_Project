import { useState } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import { submitLogin } from "./HTTP_Request ";

function Login() {
  localStorage.clear();
  sessionStorage.clear();
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');

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
  return (
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
              <div className="text-containercheckbox">แสดงรหัสผ่าน</div>
              <div className="link-containercheckbox">
                <a href="http://localhost:3000/forget_password" className="forgetpass">
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
          <a href="http://localhost:3000/CreateUser" className="dnthave">
            Don’t have an account? Sign up
          </a>
        </div>
      </div>
    </div>

  );
}

export default Login;

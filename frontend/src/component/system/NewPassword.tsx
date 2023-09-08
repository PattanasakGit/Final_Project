
import React, { useState, } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import jwt_decode from 'jwt-decode';
import {update } from './HTTP_Request ';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2

// reset รหัสผ่าน เมื่อจำรหัสผ่านไม่ได้ (กรณีที่ยังไม่ได้เข้าสู่ระบบ --> ส่งไปยัง email)
export const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const token: any = new URLSearchParams(location.search).get('token');
  const decoded: any = jwt_decode(token);
  const email = decoded.User_Email;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  let data = {
    email: email,
    new_password: newPassword,
    token: token,
    usetoken: true
  }
  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'โปรดตรวจสอบรหัสผ่านของท่านและทำรายการอีกครั้ง',
        icon: 'warning',
      });
      return;
    }
    update(data, 'resetPass');
    setNewPassword('');
    setConfirmPassword('');
  };
  return (
    <div className='reset_page'>
      <center>
        <div className="reset-password-container">
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-info">คุณกำลังเปลี่ยนรหัสผ่านของบัญชี: {email}</p>
          <div className="input_resetpass_container">
            <label htmlFor="new_password">รหัสผ่านใหม่</label>
            <input
              style={{ height: '80%' }}
              className='ThepatforInput'
              type="password"
              id="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input_resetpass_container">
            <label htmlFor="confirm_password">ยืนยันรหัสผ่านอีกครั้ง</label>
            <input
              style={{ height: '80%' }}
              className='ThepatforInput'
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button className="btn_edit" onClick={handleSubmit}>บันทึก</button>
          </div>

        </div>
      </center>
    </div>
  );
};

// reset รหัสผ่าน เมื่อสามารถเข้าสู่ระบบได้
export const ResetPasswordPage_canLogin: React.FC = () => {
  const email = localStorage.getItem('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  let data = {
    email: email,
    new_password: newPassword,
    usetoken: false
  }
  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'โปรดตรวจสอบรหัสผ่านของท่านและทำรายการอีกครั้ง',
        icon: 'warning',
      });
      return;
    }
    update(data, 'resetPass');
    setNewPassword('');
    setConfirmPassword('');
  };
  return (
    <div className='reset_page'>
      <center>
        <div className="reset-password-container">
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-info">คุณกำลังเปลี่ยนรหัสผ่านของบัญชี: {email}</p>
          <div className="input_resetpass_container">
            <label htmlFor="new_password">รหัสผ่านใหม่</label>
            <input
              style={{ height: '80%' }}
              className='ThepatforInput'
              type="password"
              id="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input_resetpass_container">
            <label htmlFor="confirm_password">ยืนยันรหัสผ่านอีกครั้ง</label>
            <input
              style={{ height: '80%' }}
              className='ThepatforInput'
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button className="btn_edit" onClick={handleSubmit}>บันทึก</button>
          </div>

        </div>
      </center>
    </div>
  );
};

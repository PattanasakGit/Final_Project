
import React, { useEffect, useState, } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import { Image, Tag } from 'antd';
import { getUserByID, fetchCategories, fillter_product, getProductByID, update } from './HTTP_Request ';
import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2

import { useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const token: any = new URLSearchParams(location.search).get('token');
  const decoded: any = jwt_decode(token);
  const email = decoded.User_Email;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  // const [message, setMessage] = useState('');

  let data = {
    email: email,
    new_password: newPassword,
    token: token
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

export default ResetPasswordPage;
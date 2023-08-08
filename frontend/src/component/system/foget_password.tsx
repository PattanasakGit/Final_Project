import React, { useState } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import { Image, Tag } from 'antd';
import { getUserByID, fetchCategories, fillter_product, getProductByID ,sendEmaiChangePassword} from './HTTP_Request ';
import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Alert text --> npm install sweetalert2

function ForgetPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        sendEmaiChangePassword(email);
    }

    return (
        <center>
            <div style={{ height: '100%', width: '90%', display: 'flex',backgroundColor:'#fff' }} className='contentPage'>
                <div style={{ width: "50%" }}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FforgetPassword.jpg?alt=media&token=e1b3389f-09e1-4c0f-9a61-cc42464171aa"
                        height='100%x' width="80%"
                    />
                </div>

                <div style={{ width: "50%", color:'#333',paddingTop:'180px'}}>
                    <h1>กรุณาป้อน Email ของคุณ</h1>
                    <h4>เราจะทำการส่งลิงค์ไปยัง Email ของคุณเพื่อทำการกำหนดรหัสผ่าน</h4>
                    <div className="input_resetpass_container" style={ { }}>
                        <input
                            style={{ height: '80%' }}
                            className='ThepatforInput'
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email Address'
                            required
                        />
                        <div className="button-container">
                            <button className="btn_edit" onClick={handleSubmit}>ดำเนินการต่อ</button>
                        </div>
                    </div>
                </div>
            </div>
        </center>
    );
}

export default ForgetPassword;

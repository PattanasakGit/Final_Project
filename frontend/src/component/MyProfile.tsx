
import React, { useEffect, useState, } from 'react';
import '../css/Background.css';
import '../css/Product.css';
import { Image, Tag } from 'antd';
import { getUserByID, fetchCategories, fillter_product, getProductByID, Check_Token, getUserByEmail, update ,sendEmaiChangePassword} from './system/HTTP_Request ';
import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2
import '../css/Profile.css';
import { height, margin } from '@mui/system';


function MyProfile() {
    Check_Token();

    const [user, setUser] = React.useState<any>([]);
    const [CheckEdit_btn, setCheckEdit_btn] = useState(false);


    const [User_ID, setUser_ID] = useState(0);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [Img, setImg] = useState('');
    const [about, setAbout] = useState('');
    // const [passworld1, setPassworld1] = useState('');
    // const [passworld2, setPassworld2] = useState('');

    async function fetchUser() {
        try {
            const response = await getUserByEmail({ email: localStorage.getItem('email') });
            setUser(response);
            setUser_ID(response.ID);
            setName(response.U_NAME.split(' ')[0]);
            setSurname(response.U_NAME.split(' ')[1])
            setGender(response.U_GENDER);
            setPhone(response.U_PHONE);
            setEmail(response.U_EMAIL);
            setImg(response.U_IMG);
            setAbout(response.ABOUT_ME);

        } catch (error) {
            console.error('พบข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value);
    };

    const handleUpdate = () => {
        let data = {
            U_NAME: name + ' ' + surname,
            U_GENDER: gender,
            U_PHONE: phone,
            U_EMAIL: email,
            U_IMG: Img,
            ABOUT_ME: about,
            // U_PASSWORD: passworld1,
            // pass1: passworld1,
            // pass2: passworld2
        }
        setCheckEdit_btn(false)
        console.log(data);
        update(data,'updateUser/'+User_ID)



    }

    const sendmail_for_resetPassword = () => {
        // const data ={
        //     email: email
        // }
        sendEmaiChangePassword(email);
        
    }






    return (
        <center>

            <div className='contentPage' style={{ height: '100%', width: '90%', padding: '20px' }}>
                <div style={{ display: 'flex' }} className='subcontentPage'>
                    <div style={{ width: '40%' }} className='img_space'>
                        {/* <input type="file" style={{ display: 'none' }} /> */}
                        <img src={Img} style={{ height: 'auto', width: '100%', maxWidth: '80%', borderRadius: '20px' }} />
                    </div>

                    <div className='Profile_text_space'>
                        <h1> MyProfile </h1>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', marginRight: '1rem' }}>
                                <label className='Profile_label'>ชื่อ </label>
                                <input type='string' className='ThepatforInput_Profile' placeholder='ชื่อ'
                                    value={name} onChange={(event) => setName(event.target.value)}
                                    disabled={!CheckEdit_btn}
                                />
                            </div>

                            <div style={{ width: '50%', marginLeft: '1rem' }}>
                                <label className='Profile_label'>นามสกุล </label>
                                <input type='string' className='ThepatforInput_Profile' placeholder='นามสกุล'
                                    value={surname} onChange={(event) => setSurname(event.target.value)}
                                    disabled={!CheckEdit_btn}
                                />
                            </div>
                        </div>

                        <div>
                            <label className='Profile_label'>เบอร์โทรศัพท์ </label>
                            <input type='string' className='ThepatforInput_Profile' placeholder='เบอร์โทรศัพท์'
                                value={phone} onChange={(event) => setPhone(event.target.value)}
                                disabled={!CheckEdit_btn}
                            />
                        </div>

                        <div>
                            <label className='Profile_label'>Email </label>
                            <input type='string' className='ThepatforInput_Profile' placeholder='Email'
                                value={email} onChange={(event) => setEmail(event.target.value)}
                                disabled
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }} className='TP_Box_radio'>
                            <label className="TP_label"> <input type="radio" value="ชาย" checked={gender === 'ชาย'} onChange={handleChange} disabled={!CheckEdit_btn} />
                                <span className="TP_span" style={{ width: '90px' }}> ชาย </span>
                            </label>
                            <label className="TP_label"> <input type="radio" value="หญิง" checked={gender === 'หญิง'} onChange={handleChange} disabled={!CheckEdit_btn} />
                                <span className="TP_span" style={{ width: '90px' }}> หญิง </span>
                            </label>
                            <label className="TP_label"> <input type="radio" value="อื่น ๆ" checked={gender === 'อื่น ๆ'} onChange={handleChange} disabled={!CheckEdit_btn} />
                                <span className="TP_span" style={{ width: '90px' }}> อื่น ๆ </span>
                            </label>
                        </div>



                        <div>
                            <label className='Profile_label'>อธิบายเพิ่มเติมเกี่ยวกับคุณ </label>
                            <textarea className='ThepatforInput_Profile' placeholder='อธิบายเพิ่มเติมเกี่ยวกับคุณ'
                                value={about} onChange={(event) => setAbout(event.target.value)}
                                style={{ minHeight: '200px', resize: 'none' }}
                                disabled={!CheckEdit_btn}
                            />
                        </div>

                        <div>
                            <button className='btn_change_pass' onClick={sendmail_for_resetPassword}>
                                เปลี่ยนรหัสผ่าน
                            </button>
                        </div>





                    </div>
                </div>
                <div style={{ marginTop: '30px' }}>
                    {CheckEdit_btn === false && <button className="btn_edit" style={{ width: '50%' }} onClick={() => setCheckEdit_btn(true)}> แก้ไข Profile </button>}
                    {CheckEdit_btn === true && <button className="btn_edit" style={{ width: '10%',backgroundColor:'red' }} onClick={() => setCheckEdit_btn(false)}>ยกเลิก </button>}
                    {CheckEdit_btn === true && <button className="btn_edit" style={{ width: '40%',backgroundColor:'green' }} onClick={handleUpdate}> อัพเดตข้อมูลของคุณ </button>}

                </div>
            </div>

        </center>

    );
}

export default MyProfile;

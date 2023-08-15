
import React, { ChangeEvent, useEffect, useRef, useState, } from 'react';
import '../css/Background.css';
import '../css/Product.css';
import { Avatar, Empty, Image, Tag } from 'antd';
import { getUserByID, fetchCategories, fillter_product, getProductByID, Check_Token, getUserByEmail, update, sendEmaiChangePassword } from './system/HTTP_Request ';
import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2
import '../css/Profile.css';
import { height, margin } from '@mui/system';
import TransgenderIcon from '@mui/icons-material/Transgender';


import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from './system/firebase';
const URL_backend = 'http://localhost:3000';




function MyProfile() {
    Check_Token();
    const Email_User = localStorage.getItem('email');
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
    const [old_IMG, setOld_IMG] = useState<any>([]);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // สำหรับการอัพโหลลด รูปภาพเข้า FireBase
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [lock_bnt, setlock_bnt] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [oder_img_in_list, setOder_img_in_list] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

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
            setOld_IMG(response.U_IMG)
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

    const handleUpdate = async () => {
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
        if (selectedImages.length !== 0) {
            Swal.fire({
                icon: 'warning',
                title: 'คุณยังไม่อัพโหลดภาพโปรไฟล์ใหม่ของคุณ',
                text: 'หากดำเนินการต่อ ระบบจะใช้ภาพโปรไฟล์เก่าของคุณ',
                showCancelButton: true,
                confirmButtonText: 'OK',
                // denyButtonText: ``,
            }).then((result) => {
                if (result.isConfirmed) {
                    setImg(old_IMG);
                    data.U_IMG = old_IMG;
                    setCheckEdit_btn(false)
                    setSelectedImages([]);
                    update(data, 'updateUser/' + User_ID);
                }
            })

        } else {
            setCheckEdit_btn(false);
            console.log(data);
            update(data, 'updateUser/' + User_ID);
        }




    }

    const sendmail_for_resetPassword = () => {
        // sendEmaiChangePassword(email);
        // ResetPasswordPage_canLogin;
        window.open(URL_backend+'/ChangePassword');

    }



    //------------------------------------------------------------------------------------------------------------------------------------------
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            setSelectedImages([selectedImage]);
            setImg(URL.createObjectURL(selectedImage)); // Show selected image before uploading
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onUploadSelectedImage = async () => {
        setIsLoading(true);
        const selectedImage = selectedImages[0];
        const storageRef = ref(storage, `/images/Users/${Email_User}/profile/${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            async () => {
                try {
                    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    setImg(downloadUrl); // Update the image URL after successful upload
                    setIsLoading(false);
                    setSelectedImages([]);
                    return true;
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    return false;
                }
            }
        );
    };

    const handleUploadButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click(); // เมื่อคลิกปุ่มอัปโหลด ให้เรียกใช้ click ของ input
        }
    };

    function alert_before_upload() {
        onUploadSelectedImage();
        // return (
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'อัพโหลดรูปภาพ',
        //         text: 'คุณต้องการอัพโหลดภาพโปรไฟล์เข้าสู่ระบบ',
        //         showCancelButton: true,
        //         confirmButtonText: 'upload',
        //         denyButtonText: `Don't upload`,
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             onUploadSelectedImage();
        //         }
        //     })
        // )
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //  fn() สำรับเช็ตว่า โหลดภาพโปรไฟล์ได้ไหม
    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };





    return (
        <center>

            <div className='contentPage' style={{ height: '100%', width: '90%', padding: '20px' }}>
                <div style={{ display: 'flex' }} className='subcontentPage'>
                    <div className='Profile_IMG_space'>
                        {/* <input type="file" style={{ display: 'none' }} /> */}

                        {Img !== '' && (
                            <div className='container_IMG'>
                                <img
                                    src={Img}
                                    onLoad={handleImageLoad}
                                    style={{ display: isImageLoaded ? 'block' : 'none', height: 'auto', width: '100%', maxWidth: '80%', borderRadius: '20px', border: '6px solid #3333339e' }}
                                    alt="Product"
                                />
                                {isImageLoaded || !isImageLoaded && (
                                    <div className='TP_text_product_seller' style={{ color: '#D8D9DA' }}>
                                        <h2>ไม่พบรูปภาพ</h2>
                                        <h4> หากต้องการเพิ่มภาพโปรไฟล์ โปรดกด "แก้ไข Profile" ด้านล่าง</h4>
                                        <Empty />
                                    </div>
                                )}
                            </div>
                        )}
                        {Img === '' && (
                            <div className='TP_text_product_seller' style={{ color: '#D8D9DA' }}>
                                <h2>ไม่พบรูปภาพ</h2>
                                <h4> หากต้องการเพิ่มภาพโปรไฟล์ โปรดกด "แก้ไข Profile" ด้านล่าง</h4>
                                <Empty />
                            </div>
                        )
                        }

                        <input type="file" style={{ display: 'none' }} onChange={onFileChange} ref={inputRef} />
                        {selectedImages.length === 0 && CheckEdit_btn === true && (
                            <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button>
                        )}
                        {selectedImages.length !== 0 && CheckEdit_btn === true && (
                            <div >
                                <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button> <br />
                                <button onClick={alert_before_upload} className='Btn_upload'>ฉันต้องการใช้ภาพนี้</button>
                            </div>
                        )}

                        {isLoading && (
                            <div>
                                <div className="file-upload-progress">
                                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div>
                                    <p>กำลังอัพโหลดไฟล์ที่ {oder_img_in_list}: <b>{progress}%</b></p>
                                </div>
                            </div>

                        )}








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
                                style={{backgroundColor:'#00000045',color:'#fff',textAlign:'center'}}
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
                                <span className="TP_span" style={{ width: '90px' }}> อื่นๆ </span>
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
                    {CheckEdit_btn === true && <button className="btn_edit" style={{ width: '10%', backgroundColor: 'red' }} onClick={() => setCheckEdit_btn(false)}>ยกเลิก </button>}
                    {CheckEdit_btn === true && <button className="btn_edit" style={{ width: '40%', backgroundColor: 'green' }} onClick={handleUpdate}> อัพเดตข้อมูลของคุณ </button>}

                </div>
            </div>

        </center>

    );
}

export default MyProfile;

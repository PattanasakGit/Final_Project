import '../../css/Product.css';
import '../../css/Profile.css';
import '../../css/Background.css';
import Swal from 'sweetalert2';
import { Empty } from 'antd';
import React, { ChangeEvent, useEffect, useRef, useState, } from 'react';
import { Check_Token, getUserByEmail, update } from '../WebSystem/HTTP_Request ';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from '../WebSystem/firebase';

const PortFrontend = import.meta.env.VITE_URL_FRONTEND

function MyProfile() {
    Check_Token();
    const Email_User = localStorage.getItem('email');
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
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    async function fetchUser() {
        try {
            const response = await getUserByEmail({ email: localStorage.getItem('email') });
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
        }
        if (selectedImages.length !== 0) {
            Swal.fire({
                icon: 'warning',
                title: 'คุณยังไม่อัพโหลดภาพโปรไฟล์ใหม่ของคุณ',
                text: 'หากดำเนินการต่อ ระบบจะใช้ภาพโปรไฟล์เก่าของคุณ',
                showCancelButton: true,
                confirmButtonText: 'OK'
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
        window.open(PortFrontend+'/ChangePassword');
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

                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} ref={inputRef} />
                        {selectedImages.length === 0 && CheckEdit_btn === true && (
                            <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button>
                        )}
                        {selectedImages.length !== 0 && CheckEdit_btn === true && (
                            <div >
                                <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button> <br />
                                <button onClick={alert_before_upload} className='Btn_upload'> อัพโหลดรูปภาพ </button>
                            </div>
                        )}

                        {isLoading && (
                            <div>
                                <div className="file-upload-progress">
                                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div>
                                    <p>กำลังอัพโหลดไฟล์: <b>{progress}%</b></p>
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
                    {CheckEdit_btn === true && <button className="btn_edit" style={{ width: '50%', backgroundColor: 'green' }} onClick={handleUpdate}> อัพเดตข้อมูลของคุณ </button>}
                    {CheckEdit_btn === true && <button className="btn_edit" style={{ width: '30%', backgroundColor: '#F24C3D' }} onClick={() => setCheckEdit_btn(false)}>ยกเลิก </button>}
                </div>
            </div>
        </center>
    );
}
export default MyProfile;
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import '../css/Background.css';
import moment from 'moment';
import { Check_Token, addFRAUD_REPORT, getUserByEmail } from './system/HTTP_Request ';
import { Avatar, Rating } from '@mui/material';
import { Image, } from 'antd';

import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from './system/firebase';
import Swal from 'sweetalert2';
const url_frontend = 'http://localhost:3000';

const Seller_Email = sessionStorage.getItem('User_Seller_Data_for_Report');

function FraudReport() {
    interface DataType_User_Seller {
        U_EMAIL: string;
        EMAIL_RW: string;
        RATE: number;
        COMMENT: string;
    }
    //Data for submit
    const [Title, setTitle] = useState('');
    const [Information, setInformation] = useState('');
    const [IMG_FRAUD_REPORT, setIMG_FRAUD_REPORT] = useState('');
    const data_to_backend = {
        TITLE: Title,
        INFORMATION: Information,
        IMG_FRAUD_REPORT: IMG_FRAUD_REPORT,
        SELLER: Seller_Email,
        EMAIL_REPORTER: localStorage.getItem('email'),
    };

    //user
    const [data_user_for_check, set_data_user_for_check] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [User_ID, setUser_ID] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [Img, setImg] = useState('');
    const [about, setAbout] = useState('');
    const [U_REGISTER, set_U_REGISTER] = useState('');
    const [U_REVIEWS, set_U_REVIEWS] = useState<[DataType_User_Seller] | undefined>();

    //date
    const dateString = U_REGISTER;
    const dateObject = moment(dateString, 'DD-MM-YYYY').toDate();
    const currentDate = new Date();
    const new_d = moment(currentDate).diff(dateObject, 'days');
    const Y = Math.floor(new_d / 365);
    const remainingDays = new_d % 365;
    const M = Math.floor(remainingDays / 30);
    const D = remainingDays % 30;

    function formatNumber(number: number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    //----------------- ดึงข้อมูล User ----------------------------
    async function fetchUser() {
        try {
            const response = await getUserByEmail({ email: Seller_Email });
            set_data_user_for_check(response);
            setUser_ID(response.ID);
            setName(response.U_NAME);
            setPhone(response.U_PHONE);
            setImg(response.U_IMG);
            setAbout(response.ABOUT_ME);
            set_U_REGISTER(response.U_REGISTER);
            set_U_REVIEWS(response.U_REVIEWS);

        } catch (error) {
            console.error('พบข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
        }
    }

    const calculateAverageRating = () => {
        if (U_REVIEWS && U_REVIEWS.length > 0) {
            const totalRating = U_REVIEWS.reduce((sum, review) => sum + review.RATE, 0);
            const averageRating = totalRating / U_REVIEWS.length;
            setUserRating(averageRating)
            return averageRating;
        } else {
            return 0;
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    useEffect(() => {
        calculateAverageRating();
    }, [U_REVIEWS]);

    const handleSubmit = (event: React.FormEvent) => {
        Check_Token();
        if (!data_to_backend.TITLE || !data_to_backend.INFORMATION || !data_to_backend.SELLER || !data_to_backend.EMAIL_REPORTER) {
            Swal.fire({
                title: 'ยังมีข้อมูลจำเป็นที่คุณยังไม่กรอก',
                text: 'กรุณาตรวจสอบและกรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนการบันทึกรายการ',
                icon: 'warning',
            });
        } else {
            event.preventDefault();
            addFRAUD_REPORT(data_to_backend);
            console.log('data_to_backend ', data_to_backend);
        }
    }

    //--------------------------------------       // ฟังก์ชันอัปโหลดรูปภาพที่เลือก    ---------------------------------------
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [Img_Select, set_Img_Select] = useState<string | null>(null); // URL.createObjectURL(selectedImage)
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref สำหรับ input file element
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    // ฟังก์ชันเรียกเมื่อมีการเลือกไฟล์รูปภาพ
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            setSelectedImages([selectedImage]);
            set_Img_Select(URL.createObjectURL(selectedImage)); // Show selected image before uploading
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
    const onUploadSelectedImage = async () => {

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        setIsLoading(true);
        const selectedImage = selectedImages[0];
        const storageRef = ref(storage, `/images/FraudReport/${formattedDate}/${Date.now()}`);
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
                    setIsLoading(false);
                    setSelectedImages([]);
                    setIMG_FRAUD_REPORT(downloadUrl);
                    // Create_Ads(data_to_backend);

                    return true;
                } catch (error: any) {
                    console.error('Error getting download URL:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'พบข้อผิดพลาด',
                        text: error.message,
                        showCancelButton: false,
                        // showConfirmButton: false,
                    })
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



    return (
        <center>
            <div className='contentPage' style={{ height: '100%', width: '90%', padding: '20px' }}>

                {data_user_for_check.length !== 0 ? (
                    <>
                        <h1 className='topic_main_Fraud_Report' >
                            รายงานการโกง
                        </h1>

                        <div className='container_fraud_report'>
                            <div className='container_profile_seller_Fraud_Report' id='container_profile_seller_Fraud_Report'>
                                <div className='container_shop' style={{ width: '100%', height: '90%', backgroundColor: '#00000095', border: '5px solid #00000025' }}>
                                    <Avatar style={{ height: '200px', width: '200px', border: '6px solid #33333367' }} src={Img} />
                                    {/* <img src={Img} style={{width:'50%', borderRadius:'20px'}} /> */}
                                    <p> {name} </p>
                                    <p> เป็นสมาชิกมาแล้ว : {Y} ปี {M} เดือน {D} วัน </p>
                                    <p>" {about} "</p>
                                    <div style={{ backgroundColor: '#ffffff', width: '80%', borderRadius: '20px', border: '2px solid orange', padding: '5px', boxShadow: '8px 5px 10px rgba(0, 0, 0, 0.477)', }}>
                                        <Rating value={userRating} readOnly size='large' precision={0.5} />
                                        {U_REVIEWS && U_REVIEWS.length > 0 && (
                                            <p style={{ color: '#333', marginTop: '5px' }}>จากผู้รีวิวทั้งหมด {U_REVIEWS.length} รายการ</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='container_information_Fraud_Report' id='container_information_Fraud_Report'>
                                <div className='Fraud_Repoard_form'>
                                    <p> โปรดแจ้งข้อมูลเพิ่มเติมให้เราทราบ ทีมงานจะตรวจสอบและดำเนินการต่อไป ขอบคุณครับ </p>
                                    <div>
                                        <p style={{ margin: '10px 0px', textAlign: 'left' }} >หัวข้อเรื่อง *</p>
                                        <input className='normal_input' type="text" id="title" name="title" value={Title} onChange={(event) => setTitle(event.target.value)} required />
                                    </div>
                                    <div>
                                        <p style={{ margin: '10px 0px', textAlign: 'left' }}> รายละเอียดเพิ่มเติม *</p>
                                        <textarea className='textarea_input' id="information" name="information" value={Information} onChange={(event) => setInformation(event.target.value)} required />
                                    </div>

                                    <div>
                                        <p style={{ margin: '10px 0px', textAlign: 'left' }}> อัพโหลดหลักฐานประกอบเพิ่มเติม(หากมี) </p>
                                        <div style={{ backgroundColor: '#ffffff55', padding: '5px', width: '95%', borderRadius: '15px', }}>
                                            <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                                            {Img_Select &&
                                                <div >
                                                    <Image src={Img_Select} alt="Selected" style={{ height: '150px' }} />
                                                    <p style={{ color: '#333', fontSize: '12px' }}> *กดที่รูปเพื่อดูรายละเอียด </p>
                                                </div>}
                                            <input className='normal_input' type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} ref={inputRef} />
                                            {selectedImages.length === 0 && (
                                                <button onClick={handleUploadButtonClick} className='btn_select_file' style={{ margin: 0 }}>เลือกภาพเพื่ออัปโหลด</button>
                                            )}
                                            {selectedImages.length !== 0 && (
                                                <div style={{ margin: 0 }}>
                                                    <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button>
                                                    <button onClick={alert_before_upload} className='Btn_upload' style={{ marginTop: '0px' }}>บันทึกหลักฐานนี้เพื่อตรวจสอบ</button>
                                                </div>
                                            )}
                                            {isLoading && (
                                                <div>
                                                    <div className="file-upload-progress">
                                                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                    <div>
                                                        <p>กำลังอัพโหลดข้อหลักฐานเพื่อตรวจสอบ: <b>{progress}%</b></p>
                                                    </div>
                                                </div>
                                            )}
                                            <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={handleSubmit} type="submit" className='btn_FraudReport'> รายงาน </button>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </>
                ) : (
                    <h1> กำลังโหลดข้อมูล ขอภัยหากไม่สามารถใช้งานหน้านี้ได้<br />โปรดติดต่อเราโดยตรงหากคุณต้องการความช่วยเหลือ </h1>
                )}









            </div>
        </center>
    );
}

export default FraudReport;

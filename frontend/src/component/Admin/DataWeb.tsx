import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminCheckProduct.css';
import '../../css/Admin_DataWeb.css';

import { getDataWeb, update } from '../system/HTTP_Request ';
import Swal from 'sweetalert2';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from '../system/firebase';

const url = 'http://localhost:3000';

function DataWeb() {
    interface DataWebType {
        ID: number;
        W_NAME: string;
        W_ADDR: string;
        W_CONTACT: string;
        W_EMAIL: string;
        ABOUT_WEB: string;
        W_IMG: string;
    }
    const [DataWeb, setDataWeb] = useState<DataWebType[]>([]);
    const [W_NAME, setW_NAME] = useState('');
    const [W_ADDR, setW_ADDR] = useState('');
    const [W_CONTACT, setW_CONTACT] = useState('');
    const [ABOUT_WEB, setABOUT_WEB] = useState('');
    const [W_IMG, setW_IMG] = useState('');
    const [W_EMAIL, setW_EMAIL] = useState('');

    const listAllData = async () => {
        const DataWeb_from_backend = await getDataWeb();

        if (DataWeb_from_backend) {
            setDataWeb(DataWeb_from_backend);
            setW_NAME(DataWeb_from_backend.W_NAME || '');
            setW_ADDR(DataWeb_from_backend.W_ADDR || '');
            setW_CONTACT(DataWeb_from_backend.W_CONTACT || '');
            setABOUT_WEB(DataWeb_from_backend.ABOUT_WEB || '');
            setW_IMG(DataWeb_from_backend.W_IMG || '');
            setW_EMAIL(DataWeb_from_backend.W_EMAIL || '');
        }
    }
    useEffect(() => {
        listAllData();
    }, []);

    const submit_DataWeb = () => {
        let new_DataWeb = {
            W_NAME: W_NAME,
            W_ADDR: W_ADDR,
            W_CONTACT: W_CONTACT,
            W_EMAIL: W_EMAIL,
            ABOUT_WEB: ABOUT_WEB,
            W_IMG: W_IMG
        }
        if (W_NAME === '' || W_ADDR === '' || W_CONTACT === '' || ABOUT_WEB === '' || W_IMG === '') {
            Swal.fire({
                title: 'คุณยังกรอกข้อมูลไม่ครบถ้วน',
                html: ` โปรดตรวจสอบและดำเนินการอีกครั้ง`,
                icon: 'warning',
                showCancelButton: false,
                showLoaderOnConfirm: true,
            })
        } else {
            update(new_DataWeb, 'updateDataWeb/1');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
    //==========================================================================================================================
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref สำหรับ input file element
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    // ฟังก์ชันเรียกเมื่อมีการเลือกไฟล์รูปภาพ
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            setSelectedImages([selectedImage]);
            setW_IMG(URL.createObjectURL(selectedImage)); // Show selected image before uploading
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    // ฟังก์ชันอัปโหลดรูปภาพที่เลือก
    const onUploadSelectedImage = async () => {

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        setIsLoading(true);
        const selectedImage = selectedImages[0];
        const storageRef = ref(storage, `/images/Logo/${W_NAME}-${formattedDate}`);
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
                    setW_IMG(downloadUrl);
                    setIsLoading(false);
                    setSelectedImages([]);
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

    function upload_logo() {
        onUploadSelectedImage();
    }
    //==========================================================================================================================

    return (
        <center>
            <div style={{ width: '90%', padding: '1rem' }} className='contentPage'>

                <div className='DataWeb_container'>
                    <div className='DataWeb_left'>
                        <img src={W_IMG} className='IMG_DataWeb' />

                        <div id='upload_logo'>
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} ref={inputRef} />
                            {selectedImages.length === 0 && (
                                <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button>
                            )}
                            {selectedImages.length !== 0 && (
                                <div style={{ margin: 0 }}>
                                    <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button> <br />
                                    <hr style={{ border: 'none', height: '4px', width: '40%', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                                    <button onClick={upload_logo} className='Btn_upload' style={{ marginTop: '0' }}>ฉันต้องการใช้ Logo นี้</button>
                                </div>
                            )}
                            {isLoading && (
                                <div>
                                    <div className="file-upload-progress">
                                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div>
                                        <p>กำลังอัพโหลด Logo ของคุณ: <b>{progress}%</b></p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    <div className='DataWeb_right'>
                        <h1 className='topics_table'>  จัดกการข้อมูลเว็ปไซต์ </h1>
                        <p className='label_text_DataWeb'> ชื่อของเว็ปไซต์ </p>
                        <input type='text' value={W_NAME} onChange={(event) => setW_NAME(event.target.value)} className='text_input_DataWeb' />

                        <p className='label_text_DataWeb'> ที่อยู่ </p>
                        <textarea value={W_ADDR} onChange={(event) => setW_ADDR(event.target.value)} className='textarea_input_DataWeb' />

                        <p className='label_text_DataWeb'> ช่องทางติดต่อ </p>
                        <textarea value={W_CONTACT} onChange={(event) => setW_CONTACT(event.target.value)} className='textarea_input_DataWeb' />

                        <p className='label_text_DataWeb'> Email ระบบ </p>
                        <input value={W_EMAIL} type='text' className='text_input_DataWeb' disabled style={{ textAlign: 'center',backgroundColor:'#ffffff55'}}/>

                        <p className='label_text_DataWeb'> เกี่ยวกับเรา </p>
                        <textarea value={ABOUT_WEB} onChange={(event) => setABOUT_WEB(event.target.value)} className='textarea_input_DataWeb' />

                    </div>
                </div>
                <button onClick={submit_DataWeb} className='btn_submit_dataWeb'> บันทึกการเปลี่ยนแปลง </button>

            </div>
        </center >
    );
}

export default DataWeb;

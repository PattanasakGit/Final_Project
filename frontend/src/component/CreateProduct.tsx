
import React, { useEffect, useState, } from 'react';
import '../css/Background.css';
import '../css/Product.css';
import { Image, Tag } from 'antd';
import { submit, fetchCategories, fillter_product, getProductByID, Check_Token } from './system/HTTP_Request ';
import moment from 'moment';
import { Button, Card, CardContent, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { validateCreateProduct } from "./Validateinput";
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2



import { ChangeEvent, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from './system/firebase';




function CreateProduct() {
    Check_Token();

    const Email_User = localStorage.getItem('email');
    const [categories, setCategories] = useState([]);
    const [type, settype] = useState("");
    const [category, setcategory] = useState("");
    const [Price, setPrice] = useState("");
    const [nameProduct, setnameProduct] = useState("");
    const [text, setText] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");

    // สำหรับการอัพโหลลด รูปภาพเข้า FireBase
    const [URL_IMG, setURL_IMG] = useState<any>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [lock_bnt, setlock_bnt] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [oder_img_in_list, setOder_img_in_list] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    let data = {
        'P_NAME': nameProduct,
        'P_CATEGORY': category,
        'P_PRICE': Price,
        'P_TEXT': text,
        'P_IMG': URL_IMG,
        'P_PHONE': PhoneNumber,
        'P_TYPE': type,
        'U_EMAIL': localStorage.getItem('email')
    }

    useEffect(() => {
        const fetchCategoriesData = async () => {
            const fetchedCategories: any = await fetchCategories(); // ดึงรายการหมวดหมู่จาก backend
            setCategories(fetchedCategories);
        };
        fetchCategoriesData();
    }, []);

    const handleSetTextParam = (value: string) => {
        setcategory(value);
    }
    const handleTypeChange = (event: any) => {
        settype(event.target.value);
    };

    const submit_btn = async () => {

        if (validateCreateProduct(data).isValid) {  //ผ่าน ไม่มี errors
            // submit(data,Path) //ส่งข้อมูลไป fetch  เพื่อส่งข้อมูลผ่าน api ไป backend 
            if (URL_IMG.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'คุณยังไม่อัพโหลดรูปภาพนะ',
                    text: 'หากดำเนินการต่อ รายการของคุณจะไม่มีรูปภาพแสดง',
                    showCancelButton: true,
                    confirmButtonColor: 'green',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await submit(data, 'createProduct');
                    }
                })
            } else {
                await submit(data, 'createProduct');
                // settype('')
                // setcategory('')
                // setPrice('')
                // setnameProduct('')
                // setText('')
                // setPhoneNumber('')
                // URL_IMG([])
                // window.location.reload();
            }

        } else { //ตรวจพบ errors
            Swal.fire({
                titleText: validateCreateProduct(data).messageErrors[0],
                icon: 'warning',
            })
        }
    }


    // // สำหรับการอัพโหลดรูปภาพ เมื่ออัพโหลดแล้ว  จะบันทึก Path ไว้ใน photos
    // const handleUploadSuccess = (downloadUrl: string) => {
    //     console.log('Uploaded successfully:', downloadUrl);
    //     // ใส่โค้ดที่ต้องการทำเมื่ออัปโหลดรูปภาพสำเร็จในส่วนนี้
    // };

    //------------------------------------------------------------------------------------------------------------------------------------------
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...filesArray]);
        }
        //เงื่อนไขนี้จะทำให้ อัพโหลดภาพเดิมซ้ำได้
        if (inputRef.current) {
            inputRef.current.value = '';
        }

    };

    const onUploadSelectedImages = async () => {
        setlock_bnt(true);
        setIsLoading(true);
        const uploadedImageUrls: string[] = [];

        for (const selectedImage of selectedImages) {
            const storageRef = ref(storage, `/images/Users/${Email_User}/products/${Date.now()}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedImage);

            await new Promise<void>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                        reject();
                    },
                    async () => {
                        try {
                            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            uploadedImageUrls.push(downloadUrl);
                            setOder_img_in_list(oder_img_in_list + 1);
                            resolve();
                        } catch (error) {
                            console.error('Error getting download URL:', error);
                            reject();
                        }
                    }
                );
            });
        }

        // onUploadSuccess(uploadedImageUrls); // url ของภาพ  ที่อัพโหลดเสร็จ
        setURL_IMG(uploadedImageUrls);
        setIsLoading(false);
        setOder_img_in_list(1);
        // setSelectedImages([]);
    };

    const onRemoveImage = (index: number) => {
        setSelectedImages((prevSelectedImages) => {
            const newSelectedImages = [...prevSelectedImages];
            const removedImage = newSelectedImages.splice(index, 1)[0]; // ลบภาพออกจาก index
            URL.revokeObjectURL(URL.createObjectURL(removedImage)); // ลบ URL ออกจากเซสชัน
            return newSelectedImages;
        });
    };

    const renderSelectedImagesPreview = ({ disableUploadButton }: any) => {
        return (
            <div className="image-grid">
                {selectedImages.map((selectedImage, index) => (
                    <div key={index} className="image-card">
                        <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt={`Selected Image ${index}`}
                            style={{ borderRadius: '15px' }}
                            className='IMG_Upload'
                        />
                        <br />
                        {!lock_bnt && (
                            <button className='Btn_cancle_upload' onClick={() => onRemoveImage(index)}>ลบ</button>
                        )}
                    </div>
                ))}
                {selectedImages.length < 6 && !disableUploadButton && !lock_bnt && (
                    <button onClick={handleUploadButtonClick} className='Btn_select_file' style={{ width: 'auto' }}>
                        เลือกภาพ{<br />}เพื่ออัปโหลด
                    </button>
                )}
            </div>
        );
    };

    const handleUploadButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click(); // เมื่อคลิกปุ่มอัปโหลด ให้เรียกใช้ click ของ input
        }
    };


    function alert_before_upload() {
        return (
            Swal.fire({
                icon: 'warning',
                title: 'อัพโหลดรูปภาพ',
                text: 'เมื่อคุณดำเนินการต่อ จะไม่สามารถเปลี่ยนแปลงรูปภาพที่ท่านเลือกได้',
                showCancelButton: true,
                confirmButtonText: 'upload',
                denyButtonText: `Don't upload`,
            }).then((result) => {
                if (result.isConfirmed) {
                    onUploadSelectedImages();
                }
            })
        )
    }
    //------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <center>

            <div className='contentPage' style={{ height: '100%', width: '90%', padding: '20px' }}>
                <div style={{ display: 'flex' }} className='subcontentPage'>
                    <div style={{ width: '40%' }} className='img_space'>
                        <h1> รูปภาพของสินค้า </h1>
                        <p style={{ fontSize: '12px', color: '#333' }}>*หมายเหตุ ภาพแรกจะเป็นภาพปกเมื่อลูกค้าทำการค้นหา</p>
                        <input type="file" style={{ display: 'none' }} onChange={onFileChange} ref={inputRef} />
                        {selectedImages.length === 0 && (
                            <button onClick={handleUploadButtonClick} className='Btn_select_file' style={{ width: 'auto' }}>
                                เลือกภาพเพื่ออัปโหลด
                            </button>
                        )}
                        {selectedImages.length > 0 && (
                            <div className="file-upload-container">
                                {renderSelectedImagesPreview({ disableUploadButton: selectedImages.length >= 6 })}
                                {!lock_bnt && ( //ถ้าเคยกดอัพโหลดรูปภาพแล้วปุ่มจะหายไป
                                    <button onClick={alert_before_upload} className='Btn_upload'>ฉันต้องการใช้ภาพเหล่านี้</button>
                                )}
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

                    <div style={{ width: '60%', justifyContent: 'flex-end' }} className='text_space'>
                        <h1> ประกาศขายสินค้า </h1>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <label style={{ fontSize: '16px' }}>ชื่อสินค้า : </label>
                            <input type='string' className='ThepatforInput' placeholder='ชื่อสินค้า'
                                onChange={(event) => setnameProduct(event.target.value)}
                                value={nameProduct}
                                style={{ width: '60%', backgroundColor: '#fff', margin: '5px 5% 5px 1%' }}
                            />
                        </div>


                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <label style={{ fontSize: '16px' }}>หมวดหมู่ :</label>
                            <Select value={category} onChange={(event) => handleSetTextParam(event.target.value as string)} className='TP_combobox_search' style={{ width: '62.8%', margin: '5px 5% 5px 1%' }}>
                                {categories.map((category: any) => (
                                    <MenuItem key={category.ID} value={category.CP_NAME}>
                                        <img src={category.CP_ICON} style={{ height: '30px', width: '30px', marginRight: '1rem' }} />
                                        {category.CP_NAME}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }} className='TP_Box_radio'>
                            <label className="TP_label"> <input type="radio" value="สินค้ามือ 1" checked={type === 'สินค้ามือ 1'} onChange={handleTypeChange} />
                                <span className="TP_span" style={{ width: '90px' }}> มือ1 </span>
                            </label>
                            <label className="TP_label"> <input type="radio" value="สินค้ามือ 2" checked={type === 'สินค้ามือ 2'} onChange={handleTypeChange} />
                                <span className="TP_span" style={{ width: '90px' }}> มือ2 </span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <label style={{ fontSize: '16px' }}>ราคา :</label>
                            <input type='number' className='ThepatforInput' placeholder='ราคาสินค้า'
                                onChange={(event) => setPrice(event.target.value)}
                                value={Price}
                                style={{ width: '60%', backgroundColor: '#fff', margin: '5px 5% 5px 1%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <label style={{ fontSize: '16px' }}>เกี่ยวกับสินค้า :</label>
                            <textarea className='ThepatforInput' placeholder='รายละเอียดสินค้า'
                                onChange={(event) => setText(event.target.value)}
                                value={text}
                                style={{ width: '60%', minHeight: '200px', backgroundColor: '#fff', resize: 'none', margin: '5px 5% 5px 1%' }}>
                            </textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <label style={{ fontSize: '16px' }}>Tel :</label>
                            <input type='string' className='ThepatforInput' placeholder='เบอร์โทรศัพท์'
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                value={PhoneNumber}
                                style={{ width: '60%', backgroundColor: '#fff', margin: '5px 5% 5px 1%' }}
                            />
                        </div>



                    </div>
                </div>
                <div style={{ marginTop: '30px' }}>
                    <Button variant="contained" className="TP_fun_button" onClick={submit_btn}>
                        ประกาศขายสินค้า
                    </Button>
                </div>
            </div>

        </center>

    );
}

export default CreateProduct;
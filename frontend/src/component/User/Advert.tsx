import '../../css/Product.css';
import '../../css/Profile.css';
import '../../css/Background.css';
import '../../css/Advert.css';
import Swal from 'sweetalert2';
import { Empty, Image, Tag } from 'antd';
import { storage } from '../WebSystem/firebase';
import { Card, CardContent, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState, } from 'react';
import { Create_Ads, getAdvertByProduct } from '../WebSystem/HTTP_Request ';
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';

interface DataType {
    key: number;
    ID: number;
    P_NAME: string;
    P_CATEGORY: string;
    P_PRICE: number;
    P_TYPE: string;
    P_POST: string;
    P_UPDATE: string;
    P_STATUS: string;
    P_IMG: string[];
    P_ADS: boolean;
}
const product_Str = localStorage.getItem('DataProduct_Ads');
let product: DataType = { key: 0, ID: 0, P_NAME: '', P_CATEGORY: '', P_PRICE: 0, P_TYPE: '', P_ADS: false, P_POST: '', P_UPDATE: '', P_STATUS: '', P_IMG: [] };
if (product_Str) {
    product = JSON.parse(product_Str);
}
function Advert() {
    //----------------------------------------- เกี่ยวกับการเช็คโฆษณา -------------------------------------------------------
    interface dataAdsType { ID: Number; P_ID: Number; Ad_CREATE_BILL: string; Ad_IMG: string; Ad_CHECKED: boolean; }
    const [dataAdsStatus, setDataAdsStatus] = useState<dataAdsType>({ ID: 0, P_ID: 0, Ad_CREATE_BILL: '', Ad_IMG: '', Ad_CHECKED: false, });
    const Check_Advert = async () => {
        try {
            const datatTest = await getAdvertByProduct(product.ID);
            setDataAdsStatus(datatTest);
        } catch (error) {
            console.error('Failed to fetch Advert:', error);
        }
    }
    useEffect(() => {
        Check_Advert();
    }, []);
    //-------------------------------------------------------------------------------------------------------------------
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [img, setImg] = useState<string | null>(null); // URL.createObjectURL(selectedImage)
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref สำหรับ input file element
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    let data_to_backend = {
        P_ID: product.ID,
        Ad_IMG: img,
    }
    //-------------------------------------------------------------------------------------------------------------------
    // ฟังก์ชันเรียกเมื่อมีการเลือกไฟล์รูปภาพ
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
    // ฟังก์ชันอัปโหลดรูปภาพที่เลือก
    const onUploadSelectedImage = async () => {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        setIsLoading(true);
        const selectedImage = selectedImages[0];
        const storageRef = ref(storage, `/images/Money_Slip/${formattedDate}/${product.ID}_${Date.now()}`);
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
                    data_to_backend.Ad_IMG = downloadUrl;
                    Create_Ads(data_to_backend);
                    return true;
                } catch (error: any) {
                    console.error('Error getting download URL:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'พบข้อผิดพลาด',
                        text: error.message,
                        showCancelButton: false,
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
            <div className='top_img_in_ADS'>
                <img style={{ width: '100%',margin:0 }} src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2F%E0%B8%9B%E0%B9%89%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99%E0%B9%82%E0%B8%86%E0%B8%A9%E0%B8%93%E0%B8%B2.png?alt=media&token=9e8ce507-d90c-491f-a303-4f7712f0195a" />
            </div>
            <div className='bg_crad'>
                {cardProductAds()}
            </div>
            <div style={{ height: '100%', width: '90%', backgroundColor: '#ffffff89', marginTop: '10px' }} className='contentPage'>
                <div style={{ backgroundColor: '#DAC0A3', padding: '5px', marginTop: '10px' }}>
                    <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />

                    <h2 style={{ color: '#333' }}>ผู้ขายลงโฆษณาได้ครั้งละ 30 วัน  <br />ค่าบริการเพียง 29 บาท/ครั้ง</h2>
                    <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                </div>
                <div style={{ color: '#333', padding: '1rem', width: '70%', marginTop: '10px', borderRadius: '20px' }}>
                    <p style={{ fontSize: '20px' }}> รายละเอียดเพิ่มเติม </p>
                    <p> โฆษณาสินค้าและการขายถูกจัดเตรียมอย่างประณีตในระบบของเรา<br /> เมื่อคุณโพสต์ประกาศขายสินค้า ระบบจะนำมาจัดให้เป็นกรอบสีเหลืองทอง<br /> ซึ่งจะทำให้ประกาศของคุณปรากฏบนหน้าค้นหาเป็นอันดับแรก และนั่นเป็นวิธีที่ดีที่สุดในการเพิ่มโอกาสให้ลูกค้าเห็นประกาศขายสินค้าของคุณก่อนใคร </p>
                    <p style={{ marginTop: '1rem', color: '#C58940' }}>การลงโฆษณา 1 ครั้งมีอายุการใช้งาน 30 วัน (นับจากวันที่ระบบอนุมัติ)</p>
                </div>
                <div style={{ marginTop: '1rem', color: '#ffffff' }}>
                    <img className='img_QR' src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FQR%2029%20B.png?alt=media&token=87c1d506-26d4-48ce-b967-833fe978341f' />
                </div>
                <div style={{ backgroundColor: '#DAC0A3', padding: '5px', }}>

                    {/* กรณีนี้คือยังไม่มีการโฆษราสินค้าชิ้นนี้ */}
                    {dataAdsStatus.ID === 0 && product.P_ADS === false && (
                        <div>
                            <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                            <h2 style={{ color: '#333', margin: '0' }}>อัพโหลดหลักฐานการโอน</h2>
                            {img &&
                                <div style={{ marginTop: '20px' }}>
                                    <Image src={img} alt="Selected" style={{ height: '150px' }} />
                                    <p style={{ color: '#333', fontSize: '12px' }}> *กดที่รูปเพื่อดูรายละเอียด </p>
                                </div>}<br
                            />
                            <div>
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} ref={inputRef} />
                                {selectedImages.length === 0 && (
                                    <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button>
                                )}
                                {selectedImages.length !== 0 && (
                                    <div style={{ margin: 0 }}>
                                        <button onClick={handleUploadButtonClick} className='btn_select_file'>เลือกภาพใหม่เพื่ออัปโหลด</button> <br />
                                        <hr style={{ border: 'none', height: '4px', width: '40%', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                                        <button onClick={alert_before_upload} className='Btn_upload' style={{ marginTop: '0' }}>บันทึกหลักฐานการชำระเงิน</button>
                                    </div>
                                )}
                                {isLoading && (
                                    <div>
                                        <div className="file-upload-progress">
                                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div>
                                            <p>กำลังอัพโหลดหลักฐานการชำระเงิน: <b>{progress}%</b></p>
                                        </div>
                                    </div>
                                )}
                                <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                            </div>
                        </div>
                    )}

                    {/* กรณีนี้คือ รายการมีการทำเรื่องโฆษณา แต่ยังไม่ตรวจสอบความถูกต้อง = */}
                    {dataAdsStatus.ID !== 0 && dataAdsStatus.Ad_CHECKED === false && (
                        <div>
                            <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                            <h2 style={{ color: '#333' }}>
                                รายการของคุณอยู่ระหว่างการตรวจสอบ <br /> หากตรวจสอบเสร็จสิ้นระบบจะแจ้งรายละเอียดให้คุณทราบทาง Email
                            </h2>
                            <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                        </div>
                    )}
                    {((dataAdsStatus.ID !== 0 && dataAdsStatus.Ad_CHECKED === true) || (product.P_ADS === true)) && (
                        <div>
                            <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                            <h2 style={{ color: '#333' }}> รายการของคุณอยู่ระหว่างการโฆษณา  </h2>
                            <p style={{ color: '#333' }}> รายละเอียดเกี่ยกับการซื้อโฆษณารวมถึงระยะเวลาในการโฆษณาระบบได้ทำการส่งให้คุณแล้วทาง Email ก่อนหน้านี้ <br /> หากคุณพบปัญหาโปรดติดต่อเรา เราพร้อมช่วยหลือและให้บริการแก่คุณ</p>
                            <hr style={{ border: 'none', height: '4px', backgroundImage: 'linear-gradient(to right, #C58940, #E5BA73, #ffd700)' }} />
                        </div>
                    )}
                </div>
            </div>
        </center>
    );
}
export default Advert;

function cardProductAds() {
    const send_data_to_Product = (data: any) => {
        window.location.href = '/Product/' + data.ID;
    };

    function format_Price(number: number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (
        <Card sx={{ height:'350px' , width: '250px', borderRadius: '15px', backgroundColor: '#FFFDE8', border: '4px solid #FFCC48', boxShadow: ' 10px 12px 20px #00000080', position: 'absolute' }} className='product_cardContainer' >
            <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: '0', right: '0', padding: '10px' }}>
                <img src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FICON%2FPremium%20ICON.png?alt=media&token=2da96bd0-d868-4a85-9f52-becfe26fda9b" style={{ height: '40px', width: '40px', filter: 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.9))' }} />
            </div>
            <CardContent sx={{ padding: 0 }} onClick={() => send_data_to_Product(product)} >
                <div  style={{height:'250px'}} >
                    {product.P_IMG.length > 0 ? (
                        <img src={product.P_IMG[0]} style={{height:'250px'}}/>
                    ) : (
                        <div className='TP_text_product_seller' style={{ color: '#D8D9DA' }}>
                            <p>ผู้ขายไม่ได้อัพโหลด<br />ภาพสินค้า</p>
                            <Empty />
                        </div>
                    )}
                </div>
                <p className='TP_font_in_card' >
                    {product.P_NAME}
                </p>
                <Typography variant="body1" component="div" className='TP_font'>
                    ราคา: {format_Price(product.P_PRICE)} บาท
                </Typography>
                <Typography variant="body1" component="div" fontSize={'13px'} marginTop={1}>
                    {product.P_TYPE === "สินค้ามือ 1" ? (
                        <Tag color="green" className='TP_font'> {product.P_TYPE} </Tag>
                    ) : (
                        <Tag color="gold" className='TP_font'> {product.P_TYPE} </Tag>
                    )}
                </Typography>
            </CardContent>
        </Card>
    )
}
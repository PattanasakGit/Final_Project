import '../../css/Product.css';
import '../../css/Background.css';
import { Empty, Tag } from 'antd';
import moment from 'moment';
import Swal from 'sweetalert2'
import { deepOrange } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState, } from 'react';
import { Avatar, Card, CardContent, Grid, Pagination, Rating, Typography } from '@mui/material';
import { Check_Token, getUserByEmail, getProductBy_EmailUser, addReview } from '../WebSystem/HTTP_Request ';

const PortFrontend = import.meta.env.VITE_URL_FRONTEND

interface DataType {
    key: number;
    ID: number;
    P_NAME: string;
    P_CATEGORY: string;
    P_PRICE: number;
    P_TYPE: string;
    P_POST: string;
    P_STATUS: string;
}
interface DataType_U_REVIEWS {
    U_EMAIL: string;
    EMAIL_RW: string;
    RATE: number;
    COMMENT: string;
}
function format_Price(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function Shop() {
    const userEmail = localStorage.getItem('UserEmail_for_Shop');
    const [products, setProducts] = useState<DataType[]>([]);
    const [userRating, setUserRating] = useState(0);
    //user
    const [name, setName] = useState('');
    const [Img, setImg] = useState('');
    const [about, setAbout] = useState('');
    const [U_REGISTER, set_U_REGISTER] = useState('');
    const [U_REVIEWS, set_U_REVIEWS] = useState<[DataType_U_REVIEWS] | undefined>();
    //date
    const dateString = U_REGISTER;
    const dateObject = moment(dateString, 'YYYY/MM/DD').toDate();
    const currentDate = new Date();
    const new_d = moment(currentDate).diff(dateObject, 'days');
    const Y = Math.floor(new_d / 365);
    const remainingDays = new_d % 365;
    const M = Math.floor(remainingDays / 30);
    const D = remainingDays % 30;
    //----------------- ดึงสินค้าที่ตรงกับ User ----------------------------
    async function fetchUser() {
        try {
            const response = await getUserByEmail({ email: userEmail });
            setName(response.U_NAME);
            setImg(response.U_IMG);
            setAbout(response.ABOUT_ME);
            set_U_REGISTER(response.U_REGISTER);
            set_U_REVIEWS(response.U_REVIEWS);
        } catch (error) {
            console.error('พบข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
        }
    }
    //----------------------------------------------------------------
    const send_data_to_Product = (data: any) => {
        window.location.href = '/Product/' + data.ID;
    };
    useEffect(() => {
        fetchUser();
        filter_searchProducts(currentPage);
    }, []);
    useEffect(() => {
        calculateAverageRating();
    }, [U_REVIEWS]);

    const [currentPage, setCurrentPage] = useState(1);
    const [TotalProducts, setTotalProducts] = useState(0);
    const filter_searchProducts = async (page: number) => {
        const pageSize = 9;
        const data = await getProductBy_EmailUser({ email: userEmail });
        const filteredProducts = data.filter((product: any) => product.P_STATUS === "กำลังประกาศขาย");
        const totalProducts = filteredProducts.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const productsData = filteredProducts.slice(startIndex, endIndex);
        setProducts(productsData);
        setTotalProducts(totalProducts);
    };
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        filter_searchProducts(page); // เรียกใช้งานฟังก์ชัน filter_searchProducts เพื่ออัพเดตข้อมูลสินค้าในหน้าปัจจุบัน
        window.scrollTo(0, 0); // เมื่อกดเปลี่ยนหน้าให้เลื่อนขึ้นด้านบนของหน้าเพจ
    };
    //================ review =================================
    const [RATE, setRATE] = useState(0);
    const [COMMENT, setCOMMENT] = useState("");
    let data_comment = {
        U_EMAIL: userEmail,
        EMAIL_RW: localStorage.getItem("email"),
        RATE: RATE,
        COMMENT: COMMENT
    }
    const submit_data_comment = async () => {

        Swal.fire({
            title: 'ยืนยันการรีวิว',
            html: `การรีวิวของคุณคือการรีวิวต่อผู้ขาย ไม่ใช่สินค้า <br>คุณสามารถรีวิวให้ผู้ขายได้ 1 ครั้งเท่านั้น <br>และจะไม่สามารถแก้ไขภายหลังได้ `,
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText : 'ยกเลิก',
            confirmButtonColor: '#7A9D54',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await addReview(data_comment);
            }
        });
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
    //=========== POPUP_COMMENT =============
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const openPopup = async () => {
        await Check_Token();
        setShowPopup(true);
    };

    const POPUP_COMMENT = () => {
        return (
            <div >
                {showPopup && (
                    <div className="popup_comment">
                        <div className="popup_content_comment">
                            <button className="close_button_popup_comment" onClick={togglePopup}> <CloseIcon /> </button>
                            <h3 style={{ margin: '0px ' }}>รีวิวผู้ขาย</h3>
                            <div className="popup_reviews">
                                <Rating value={RATE} className='star_review_comment' onChange={(_event, newValue: any) => { setRATE(newValue) }} /><br />
                                <textarea value={COMMENT} onChange={(event) => { setCOMMENT(event.target.value) }} className='textarea_comment' /><br />
                                <button className='btn_submit_review' onClick={submit_data_comment}>ส่งรายการรีวิว</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const fraud_repoet = () => {
        if (userEmail) {
            sessionStorage.setItem('User_Seller_Data_for_Report', userEmail);
            window.location.href = PortFrontend + '/FraudReport';
        }
    }
    return (
        <center>
            <div style={{ height: '100%', width: '90%' }} className='contentPage'>
                <div id='content_splace' className='content_splace_shop'>
                    <div className='container_shop'>
                        <Avatar style={{ height: '200px', width: '200px', border: '6px solid #33333367' }} src={Img} />
                        <p> {name} </p>
                        <p> เป็นสมาชิกมาแล้ว : {Y} ปี {M} เดือน {D} วัน </p>
                        <p>" {about} "</p>
                        <div style={{ backgroundColor: '#ffffff', width: '80%', borderRadius: '20px', border: '2px solid orange', padding: '5px', boxShadow: '8px 5px 10px rgba(0, 0, 0, 0.477)' }}>
                            <Rating value={userRating} readOnly size='large' precision={0.5} />
                            {U_REVIEWS && U_REVIEWS.length > 0 && (
                                <p style={{ color: '#333', marginTop: '5px' }}>จากผู้รีวิวทั้งหมด {U_REVIEWS.length} รายการ</p>
                            )}
                        </div>
                        <button className='btn_need_review' onClick={openPopup}>ฉันต้องการให้คะแนน</button>
                        <button className='btn_need_report' onClick={fraud_repoet} >รายงานการโกง</button>

                        {U_REVIEWS && U_REVIEWS.length > 0 ? (
                            <div>
                                <h3 style={{ margin: '15px 0px 0px 0px' }}>รีวิวร้านค้า</h3>
                                <div className="content_reviews">
                                    <div className="reviews">
                                        {U_REVIEWS && U_REVIEWS.length > 0 && U_REVIEWS.slice().reverse().map((review: DataType_U_REVIEWS) => (
                                            <div key={review.EMAIL_RW} className="card_review_in_shop">
                                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{review.EMAIL_RW[0]}</Avatar>
                                                <div><Rating value={review.RATE} readOnly size="small" /></div>
                                                <div className="comment">{review.COMMENT}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <h3>ยังไม่มีผู้รีวิวผู้ขาย/ร้านค้า</h3>
                        )}
                    </div>

                    <div id='product_splace' className='container_product_in_shop'>
                        <div style={{ height: '100%', width: '88%', marginTop: '0px', padding: 0 }} >
                            <h2 style={{ color: '#333', backgroundColor: '#ffffff9e', padding: '20px', borderRadius: '20px' }}> ประกาศขายโดยผู้ขายรายนี้ </h2>
                            <Grid container spacing={2}>
                                {/* โชว์รายการที่โฆษณาก่อน */}
                                {products
                                    .filter((product: any) => product.P_ADS === true)
                                    .map((product: any) => (
                                        <Grid item xs={6} sm={6} md={6} lg={4} key={product.ID}>
                                            <Card sx={{ width: '100%', borderRadius: '10px', backgroundColor: '#FFFDE8', position: 'relative', boxShadow: ' 0 0 0 4px #FFCC48' }} className='product_cardContainer' >
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: '0', right: '0', padding: '10px' }}>
                                                    <img src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FICON%2FPremium%20ICON.png?alt=media&token=2da96bd0-d868-4a85-9f52-becfe26fda9b" style={{ height: '40px', width: '40px', filter: 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.9))' }} />
                                                </div>
                                                <CardContent sx={{ padding: 0 }} onClick={() => send_data_to_Product(product)} >
                                                    <div className='container_show_img_in_card'>
                                                        {product.P_IMG.length > 0 ? (
                                                            <img src={product.P_IMG[0]} />
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
                                        </Grid>
                                    ))}

                                {/* โชว์รายการที่ไม่ได้โฆษณา หลังจากกลุ่มที่โฆษณา */}
                                {products
                                    .filter((product: any) => product.P_ADS !== true)
                                    .map((product: any) => (
                                        <Grid item xs={6} sm={6} md={6} lg={4} key={product.ID}>
                                            <Card sx={{ width: '100%', borderRadius: '10px' }} className='product_cardContainer' >
                                                <CardContent sx={{ padding: 0 }} onClick={() => send_data_to_Product(product)} >
                                                    <div className='container_show_img_in_card'>
                                                        {product.P_IMG.length > 0 ? (
                                                            <img src={product.P_IMG[0]} />
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
                                        </Grid>
                                    ))}
                            </Grid>
                            <hr style={{ backgroundColor: '#3333334e', border: 'none', height: '1px', marginTop: "20px" }} />
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination
                                    count={Math.ceil(TotalProducts / 9)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    siblingCount={1}
                                    boundaryCount={1}
                                    shape="rounded"
                                    variant="outlined"
                                />
                            </div>
                            <hr style={{ backgroundColor: '#3333334e', border: 'none', height: '1px' }} />
                        </div>
                    </div>
                </div>
            </div>
            {POPUP_COMMENT()}
        </center>
    );
}
export default Shop;
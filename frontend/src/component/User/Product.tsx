import '../../css/Product.css';
import '../../css/Background.css';
import moment from 'moment';
import Swal from 'sweetalert2'
import { Image, Tag, Empty } from 'antd';
import { useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { fillter_product, getProductByID, Check_Token, getUserByEmail, Every_Email } from '../WebSystem/HTTP_Request ';

let Data_seller_out: any = {};
let PhoneNumber_in_product: any = '';
const url_frontend = 'http://localhost:3000'

function format_Price(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function Product() {
    const { id } = useParams();
    const [data, setData] = useState<any>({});
    const [Data_seller, setDataSeller] = useState<any>({});
    const [products, setProducts] = useState([]);

    let data_fiter = {
        "nameProduct": '',
        "category": data.P_CATEGORY,
        "type": '',
        "minPrice": '',
        "maxPrice": ''
    }

    useEffect(() => {

        async function fetchSProductData() {
            try {
                const product = await getProductByID(id);
                setData(product);
                PhoneNumber_in_product = product.P_PHONE;
            } catch (error) {
                console.error('พบบข้อผิดพลาดไม่สามารถดึงข้อมูลสินค้าได้ ', error);
            }
        }
        async function fetchSellerData() {
            try {
                const seller = await getUserByEmail({ email: data.U_EMAIL });
                setDataSeller(seller);
                Data_seller_out = seller;
            } catch (error) {
                console.error('พบบข้อผิดพลาดไม่สามารถดึงข้อมูลผู้ขายได้ ', error);
            }
        }
        fetchSProductData();
        fetchSellerData();
        filter_searchProducts();
    }, [id, data.U_EMAIL]);

    const filter_searchProducts = async () => {
        const data = await fillter_product(data_fiter);
        const productsData = data.slice(0, 12);
        setProducts(productsData);
    };

    const send_data_to_Product = (data: any) => {
        window.location.href = '/Product/' + data.ID;
    };
    function go_to_shop_page() {
        localStorage.setItem("UserEmail_for_Shop", Data_seller.U_EMAIL);
        window.location.href = url_frontend + '/Shop';
    };
    // ส่วนของการจัดการวันเวลา
    const dateString = Data_seller.U_REGISTER;
    const dateObject = moment(dateString, 'DD-MM-YYYY').toDate();
    const currentDate = new Date();
    const new_d = moment(currentDate).diff(dateObject, 'days');
    const Y = Math.floor(new_d / 365);
    const remainingDays = new_d % 365;
    const M = Math.floor(remainingDays / 30);
    const D = remainingDays % 30;
    // แสดงข้อขัดข้องแก่ผู้ใช้งาน
    if (!data.P_NAME || !data.P_IMG || !data.P_TYPE) {
        return <div> <br /><br /><br /><br /><br />Loading...<br /><br /><br /><br /><br /></div>;
    }
    return (
        <center>
            <div style={{ height: '100%', width: '90%' }} className='contentPage'>
                <div className='product_container'>
                    <div className='product_images' style={{ marginTop: '10px' }}>
                        {data.P_IMG.slice(1).map((image: string) => (
                            <Image src={image} alt='Product Image' key={image} className='TP_IMG' />
                        ))}
                    </div>

                    <div className='product_container_img'>
                        {data.P_IMG.length > 0 ? (
                            <Image src={data.P_IMG[0]} className='TP_main_img_product' />
                        ) : (
                            <div className='TP_text_product_seller'>
                                <h2>ขออภัย</h2>
                                <p>ผู้ขายไม่ได้อัพโหลดภาพสินค้า</p>
                                <Empty />
                            </div>
                        )}
                    </div>

                    <div className='product_container_text'>
                        <h1 style={{ margin: 0 }}> {data.P_NAME}</h1>
                        <h1 style={{ margin: 1 }}> ราคา {format_Price(data.P_PRICE)} บาท</h1>
                        <h2 style={{ margin: 1 }}> {data.P_TYPE} </h2>
                        {
                            data.P_STATUS === "กำลังประกาศขาย" ? (
                                <Tag className='TP_font' color="green" > {data.P_STATUS} </Tag>
                            ) : data.P_STATUS === "รอตรวจสอบ" ? (
                                <Tag className='TP_font' color="gold" > {data.P_STATUS} </Tag>
                            ) : data.P_STATUS === "ยกเลิกประกาศขาย" ? (
                                <Tag className='TP_font' color="red" > {data.P_STATUS} </Tag>
                            ) : (<Tag className='TP_font' color="purple" > {data.P_STATUS} </Tag>)
                        }
                        <center> <h2>รายละเอียดสินค้า</h2> </center>
                        <div className='TP_text_product'>
                            {data.P_TEXT}
                        </div>
                        <div className='TP_text_product_seller'>
                            ลงประกาศขายเมื่อ {data.P_POST}
                        </div>

                        <div className='TP_text_product_seller'>
                            <h2 style={{ margin: '5px' }}> ขายโดย </h2>
                            {Data_seller.U_NAME}<br />
                            เป็นสมาชิกมาแล้ว : {Y} ปี {M} เดือน {D} วัน <br />
                            รหัสประกาศขาย : #{data.ID}
                        </div>

                        <div style={{ marginTop: '100px', textAlign: 'center' }} className='btn_want_to_buy'>
                            <button className='btn_product2' onClick={Tell}>โทรหาผู้ขาย</button>
                            <button className='btn_product1' onClick={() => need_to_buy(data)}>ให้ผู้ขายติดต่อหาคุณ</button>
                            <button className='btn_product2' onClick={go_to_shop_page}>ดูสินค้าจากร้านนี้</button>
                        </div>

                    </div>
                </div>
            </div>

            <center> <h2 className='TP_font' style={{ color: '#2d1400' }}>สินค้าเพิ่มเติมที่คุณอาจสนใจ</h2> </center>
            <div style={{ height: '100%', width: '88%' }} className="table_show_products">
                <Grid container spacing={2} >
                    {products.map((product: any) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={product.ID}>
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
            </div>
        </center>
    );
}
export default Product;

interface interface_Product { P_NAME: string, P_IMG: string, P_PRICE: number, SEND_TO: string, SUBJECT: string, CusttomerTel: string, CustomerName: string };
async function need_to_buy(product: interface_Product) {
    const Checked_token = await Check_Token()
    if (Checked_token !== false) {
        const response = await getUserByEmail({ email: localStorage.getItem('email') });
        let data = {
            CustomerName: response.U_NAME,
            CustomerEmail: response.U_EMAIL,
            CusttomerTel: response.U_PHONE
        }
        Swal.fire({
            html:
                `<center>
                    <h2>โปรดตรวจสอบข้อมูลในการติดต่อกลับ</h2>
                    <h3 style="margin: 0; background-color:#F8F0E5; ">คุณ ${data.CustomerName}</h3>
                    <h3 style="margin: 0; background-color:#EADBC8; ">เบอร์โทรศัพท์ ${data.CusttomerTel}</h3>
                    <h6 style="margin: 0;" >*หากข้อมูลส่วนตัวของคุณไม่ถูกต้อง สามารถแก้ไขได้ที่โปรไฟล์ของคุณ*<h6>
                    <h4>คุณกำลังสนใจ</h4>
                    <h4 style="margin: 0;" >ชื่อสินค้า: ${product.P_NAME}</h4>
                    <h4 style="margin: 0;" >ราคา: ${format_Price(product.P_PRICE)} บาท</h4>
                    <img style="height:200px; border-radius: 15px;" src=${product.P_IMG[0]}>
                <center>
                `,
            showConfirmButton: true,
            showCancelButton: true,
            // width: '70%',
        }).then((result) => {
            if (result.isConfirmed) {
                let newdata = product;
                newdata.SEND_TO = Data_seller_out.U_EMAIL;
                newdata.SUBJECT = 'มีผู้สนใจสินค้าของคุณโปรดติดต่อกลับ';
                newdata.CustomerName = data.CustomerName;
                newdata.CusttomerTel = data.CusttomerTel;
                Every_Email(newdata);

                let timerInterval: number
                Swal.fire({
                    title: 'ระบบกำลังแจ้งให้ผู้ขายทราบ',
                    html: `<img style="height:400px" src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2Fwait.svg?alt=media&token=bddd3431-5408-4ea9-92e8-637ad3ec3480'>`,
                    timer: 4000,
                    width: '50%',
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            }
        });
    } else {
        window.location.href = "http://localhost:3000/";
    }
}

function Tell() {
    Swal.fire({
        title: 'คุณสนใจสินค้าใช่ไหม',
        text: 'โทรหาผู้ขายโดยตรง : ' + PhoneNumber_in_product,
        showConfirmButton: true,
        confirmButtonText: 'Tell',
        confirmButtonColor: '#7A9D54',
        confirmButtonAriaLabel: 'โทร',
        showCloseButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('tel://' + PhoneNumber_in_product);
        }
    });
}
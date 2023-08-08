
import React, { useEffect, useState, } from 'react';
import '../css/Background.css';
import '../css/Product.css';
import { Image, Tag } from 'antd';
import { getUserByID, fetchCategories, fillter_product, getProductByID, Check_Token } from './system/HTTP_Request ';
import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2
let Data_seller_out: any = {}

function Product() {
    // const data_str: any = localStorage.getItem('Product');
    // const data = JSON.parse(data_str);
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
            } catch (error) {
                console.error('พบบข้อผิดพลาดไม่สามารถดึงข้อมูลสินค้าได้ ', error);
            }
        }
        async function fetchSellerData() {
            try {
                const seller = await getUserByID(data.U_ID);
                setDataSeller(seller);
                Data_seller_out = seller;
            } catch (error) {
                console.error('พบบข้อผิดพลาดไม่สามารถดึงข้อมูลผู้ขายได้ ', error);
            }
        }
        fetchSProductData();
        fetchSellerData();
        filter_searchProducts();
    }, [id, data.U_ID]);

    const filter_searchProducts = async () => {
        const data = await fillter_product(data_fiter);
        const productsData = data.slice(0, 12);
        setProducts(productsData);
    };

    const send_data_to_Product = (data: any) => {
        // localStorage.setItem("Product", JSON.stringify(data));
        window.location.href = '/Product/' + data.ID;
    };

    function formatNumber(number: number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const dateString = Data_seller.U_REGISTER;
    const dateObject = moment(dateString, 'DD-MM-YYYY').toDate();
    const currentDate = new Date();
    const new_d = moment(currentDate).diff(dateObject, 'days');
    const new_m = moment(currentDate).diff(dateObject, 'months');
    const new_y = moment(currentDate).diff(dateObject, 'years');

    // แสดงข้อขัดข้องแ่ผู้ใช้งาน
    if (!data.P_NAME || !data.P_IMG || !data.P_TYPE) {
        return <div> <br /><br /><br /><br /><br />Loading...</div>;
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
                        <Image src={data.P_IMG[0]} className='TP_main_img_product' />
                    </div>

                    <div className='product_container_text'>
                        <h1 style={{ margin: 0 }}> {data.P_NAME}</h1>
                        <h1 style={{ margin: 1 }}> ราคา {formatNumber(data.P_PRICE)} บาท</h1>
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
                            เป็นสมาชิกมาแล้ว : {new_d} วัน {new_m} เดือน {new_y} ปี <br />
                            รหัสประกาศขาย : P000#{data.ID}
                        </div>

                        <div style={{ marginTop: '100px', textAlign: 'center' }} >
                            <button className='btn_product2' onClick={Tell}>โทรหาผู้ขาย</button>
                            <button className='btn_product1' onClick={need_to_buy}>ให้ผู้ขายติดต่อหาคุณ</button>
                            <button className='btn_product2'>ดูสินค้าจากร้านนี้</button>
                        </div>

                    </div>
                </div>
            </div>




            <center> <h2 className='TP_font' style={{ color: '#2d1400' }}>สินค้าเพิ่มเติมที่คุณอาจสนใจ</h2> </center>
            <div style={{ height: '100%', width: '88%' }} className="table_show_products">
                <Grid container spacing={2} >
                    {products.map((product: any) => (
                        <Grid item xs={6} sm={6} md={5} lg={2} key={product.ID}>
                            <Card sx={{ width: '100%', borderRadius: '10px' }} className='product_cardContainer' >
                                <CardContent sx={{ padding: 0 }} onClick={() => send_data_to_Product(product)} >
                                    <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                                        <img src={product.P_IMG[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                    </div>
                                    <Typography variant="h6" component="div" className='TP_font'>
                                        {product.P_NAME}
                                    </Typography>
                                    <Typography variant="body1" component="div" className='TP_font'>
                                        ราคา: {formatNumber(product.P_PRICE)} บาท
                                    </Typography>
                                    <Typography variant="body1" component="div" fontSize={'13px'} marginTop={1} >
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


async function need_to_buy() {
    const Checked_token = await Check_Token()
    console.log(Checked_token);


    if (Checked_token !== false) {
        Swal.fire({
            html:
                '<center><h2>เราได้แจ้งผู้ขายว่าท่านสนใจสินค้าชิ้นนี้ <br/>โปรดรอการติดต่อกลับในไม่ช้า</h2><center>',
            //   showCloseButton: true,
            icon: 'success',
            showConfirmButton: false,
        }).then((result) => {
            if (result.isConfirmed) {
            } else if (result.isDenied) {
            }
        });
    }else{
        window.location.href ="http://localhost:3000/Login";
    }
}


function Tell() {
    Swal.fire({
        title: 'คุณสนใจสินค้าใช่ไหม',
        text: 'โปรดโทร : ' + Data_seller_out.U_PHONE,
        showConfirmButton: true,
        confirmButtonText: 'Tell',
        confirmButtonColor: '#7A9D54',
        confirmButtonAriaLabel: 'โทร',
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('tel://' + Data_seller_out.U_PHONE);
        }
    });
}

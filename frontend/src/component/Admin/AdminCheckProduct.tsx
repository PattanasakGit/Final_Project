import React, { useEffect, useRef, useState } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminCheckProduct.css';

import { Check_Token, listAdmins, DeleteByID, update, getProductBy_EmailUser, listProduct, getUserByEmail } from '../system/HTTP_Request ';
import CreateAdmin from '../Admin/CreateAdmin'

import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Alert text --> npm install sweetalert2
import { Space, Table, Tag, Segmented, Image, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fontSize, margin } from '@mui/system';
import { Block, CloseOutlined } from '@mui/icons-material';

const url = 'http://localhost:3000'

function format_Price(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface DataType {
    key: number;
    ID: number;
    P_NAME: string;
    P_CATEGORY: string;
    P_PRICE: number;
    P_TYPE: string;
    P_POST: string;
    P_TEXT: string;
    P_UPDATE: string;
    P_STATUS: string;
    U_EMAIL: string;
    P_IMG: string[];
    P_ADS: Boolean;
}
type DataIndex = keyof DataType;

function AdminCheckProduct() {
    Check_Token();


    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const searchInput = useRef<InputRef>(null);
    const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex,) => { confirm(); };
    const handleReset = (clearFilters: () => void) => { clearFilters(); };
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input ref={searchInput} value={selectedKeys[0]} style={{ marginBottom: 8, display: 'block' }} className='TP_font'
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                />
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }} >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }} >
                        Reset
                    </Button>
                    <Button type="link" size="small" onClick={() => { close(); }} >  close  </Button>
                </Space>
                <h6 className='TP_font'>*เมื่อ reset กรุณากดปุ่ม search เพื่อค้นหาใหม่</h6>
            </div>
        ),
        filterIcon: (filtered: boolean) => (<SearchOutlined style={{ color: filtered ? '#1677ff' : undefined, fontSize: filtered ? '25px' : undefined }} />),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase()),
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // const [ID_when_click, setID_when_click] = useState<number>();
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            className: 'TP_font',
            dataIndex: 'ID',
            key: 'ID',
            width: '80px',
            fixed: 'left',
            // render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.ID - b.ID,
            // defaultSortOrder: 'descend', // ค่าเริ่มต้นให้แสดงใหม่กว่าไว้ด้านบน
        },
        {
            title: 'ชื่อสินค้า',
            className: 'TP_font',
            dataIndex: 'P_NAME',
            key: 'P_NAME',
            // fixed: 'left',
            ...getColumnSearchProps('P_NAME'),

        },
        {
            title: 'หมวดหมู่สินค้า',
            className: 'TP_font',
            dataIndex: 'P_CATEGORY',
            key: 'P_CATEGORY',
        },
        {
            title: 'ราคาสินค้า (บาท)',
            className: 'TP_font',
            dataIndex: 'P_PRICE',
            key: 'P_PRICE',
            width: '120px',
            align: 'right',
            sorter: (a, b) => a.P_PRICE - b.P_PRICE,
            render: (_, record) => (format_Price(record.P_PRICE))
        },
        {
            title: 'ประเภทสินค้า',
            className: 'TP_font',
            dataIndex: 'P_TYPE',
            key: 'P_TYPE',
            width: '100px',
            align: 'center',
            render: (_, record) => (

                record.P_TYPE === "สินค้ามือ 1" ? (
                    <Tag color="green" className='TP_font'> {record.P_TYPE} </Tag>
                ) : (
                    <Tag color="gold" className='TP_font'> {record.P_TYPE} </Tag>
                )
            )

        },
        {
            title: 'วันที่ประกาศขาย',
            className: 'TP_font',
            dataIndex: 'P_POST',
            key: 'P_POST',
            sorter: (a, b) => a.P_POST.localeCompare(b.P_POST), // เปรียบเทียบ string
            ...getColumnSearchProps('P_POST'),
        },
        {
            title: 'วันที่แก้ไขล่าสุด',
            className: 'TP_font',
            dataIndex: 'P_UPDATE',
            key: 'P_UPDATE',
            defaultSortOrder: 'descend', // ค่าเริ่มต้นให้แสดงใหม่กว่าไว้ด้านบน
            sorter: (a, b) => a.P_UPDATE.localeCompare(b.P_UPDATE), // เปรียบเทียบ string
            ...getColumnSearchProps('P_UPDATE'),
        },
        {
            title: 'สถานะ',
            className: 'TP_font',
            dataIndex: 'P_STATUS',
            key: 'P_STATUS',
            render: (_, record) => (

                record.P_STATUS === "กำลังประกาศขาย" ? (
                    <Tag className='TP_font' color="green" > 🟢 {record.P_STATUS} </Tag>
                ) : record.P_STATUS === "รอตรวจสอบ" ? (
                    <Tag className='TP_font' color="gold" > 🟡 {record.P_STATUS} </Tag>
                ) : record.P_STATUS === "ยกเลิกประกาศขาย" ? (
                    <Tag className='TP_font' color="red" > 🔴 {record.P_STATUS} </Tag>
                ) : (<Tag className='TP_font' color="purple" >  {record.P_STATUS} </Tag>)
            )

        },
        {
            title: '',
            key: 'action',
            width: '60px',
            render: (_, record) => (
                <Space size="small">
                    <button className='btn_show' onClick={() => window.location.href = url + '/Product/' + record.ID}><VisibilityIcon /></button>
                </Space>
            )
        },
        {
            title: '',
            key: 'action',
            width: '90px',
            className: 'customCell_action',
            render: (_, record) => (
                <button onClick={() => hendle_btn_in_table(record)} className='btn_ads_true' style={{ height: '35px' }}> ตรวจสอบ </button>

            )


        },
    ];
    const [EmailSeller, setSeller] = useState('');
    const [products, setProducts] = useState<DataType[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>('รายการที่รออนุมัติ');
    const [filteredProducts, setFilteredProducts] = useState<DataType[]>(products);

    const [Data_ShowTicketPopup, setData_ShowTicketPopup] = useState<DataType>();
    const [OpenPopup, setOpenPopup] = useState(false);


    //----------------- ดึงสินค้าที่ตรงกับ User ----------------------------
    const userEmail: any = localStorage.getItem('email');
    async function Listdata() {
        const dataProduct = await listProduct();
        setProducts(dataProduct);
        setSeller(dataProduct.U_EMAIL);
    }
    //----------------------------------------------------------------
    useEffect(() => {
        Listdata();
    }, []);

    useEffect(() => {
        const filteredData = products.filter(item => {
            if (selectedTab === 'รายการที่กำลังประกาศขาย') {
                return item.P_STATUS as string === 'กำลังประกาศขาย';
            } else if (selectedTab === 'รายการที่รออนุมัติ') {
                return item.P_STATUS as string === 'รอตรวจสอบ';
            } else if (selectedTab === 'รายการที่ยกเลิกประกาศขาย') {
                return item.P_STATUS as string === 'ยกเลิกประกาศขาย';
            }
            return true;
        });
        setFilteredProducts(filteredData as any);
    }, [selectedTab, products]);

    const handleSubmit = () => { }

    const data: DataType[] = filteredProducts; //ขอมูลที่จะแสดงใน ตาราง




    const hendle_btn_in_table = (data: DataType) => {
        setData_ShowTicketPopup(data);
        setOpenPopup(!OpenPopup)

    }

    return (
        <center>
            <div style={{ height: '75vh', width: '90%', paddingBottom: '7rem' }} className='contentPage'>
                <h1 className='topics_table'>  รายการประกาศขาย </h1>

                <div className='container_btn_select'>
                    <button onClick={() => setSelectedTab('รายการที่รออนุมัติ')} className='btn_Yellow'>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img className='icon_in_btn' src='ICON/Icon_Padding.png' />
                            <div style={{ display: 'block' }}>
                                <p className='text_in_btn'> รายการที่รออนุมัติ </p>
                                <p className='small_text_in_btn'> จำนวน {products.filter(product => product.P_STATUS === 'รอตรวจสอบ').length} รายการ </p>
                            </div>
                        </div>
                    </button>
                    <button onClick={() => setSelectedTab('รายการที่กำลังประกาศขาย')} className='btn_Green'>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img className='icon_in_btn' src='ICON/Icon_Accepted.png' />
                            <div style={{ display: 'block' }}>
                                <p className='text_in_btn'>รายการที่กำลังประกาศขาย</p>
                                <p className='small_text_in_btn'> จำนวน {products.filter(product => product.P_STATUS === 'กำลังประกาศขาย').length} รายการ </p>
                            </div>
                        </div>
                    </button>
                    <button onClick={() => setSelectedTab('รายการที่ยกเลิกประกาศขาย')} className='btn_Pink'>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img className='icon_in_btn' src='ICON/Icon_Reject.png' />
                            <div style={{ display: 'block' }}>
                                <p className='text_in_btn'>รายการที่ยกเลิกประกาศขาย</p>
                                <p className='small_text_in_btn'> จำนวน {products.filter(product => product.P_STATUS === 'ยกเลิกประกาศขาย').length} รายการ </p>
                            </div>
                        </div>
                    </button>
                    <button onClick={() => setSelectedTab('All')} className='btn_blue'>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img className='icon_in_btn' src='https://img.icons8.com/?size=512&id=0a0Pgc8Lxvoe&format=png' />
                            <div style={{ display: 'block' }}>
                                <p className='text_in_btn'>{"All"}</p>
                                <p className='small_text_in_btn'> จำนวน {products.length} รายการ </p>
                            </div>
                        </div>
                    </button>
                </div>


                <div className='div_cover_table_and_tab'>
                    {/* <Segmented
                        block
                        options={['รายการที่กำลังประกาศขาย', 'รายการที่รออนุมัติ', 'รายการที่ยกเลิกประกาศขาย', 'รายการทั้งหมด']}
                        onChange={newTab => setSelectedTab(newTab as string)}
                        className='tp_tab'
                    /> */}

                    <Table
                        scroll={{ x: 1300 }}
                        columns={columns}
                        dataSource={data.map(item => ({ ...item, key: item.ID }))}
                        // scroll={{ y: 750 }}
                        size='small'
                        bordered
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                            position: ['bottomCenter'],
                            className: 'TP_pagination_table'
                        }}
                    />

                </div>


            </div>
            {OpenPopup && Data_ShowTicketPopup && (
                <div className='popupShowTicket'>
                    <div className="popupContent">
                        <div className='bar_title_popup'>
                            <h3 className='TP_font' style={{ flex: 1, paddingLeft: '65px', color: '#888' }}> ตรวจสอบประกาศขาย </h3>
                            <button onClick={() => (setOpenPopup(!OpenPopup))} className='btn_delete' style={{ marginRight: '5px' }}>
                                <CloseOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </button>
                        </div>
                        <div style={{ padding: '10px 0px', display: 'flex', justifyContent: 'center' }}>

                            {showDataTicket(Data_ShowTicketPopup)}


                        </div>

                    </div>
                </div>
            )}
        </center>



    );
}

export default AdminCheckProduct;


const showDataTicket = (data: any) => {

    const hendle_update_status = (status: any) => {
        let newData = {
            ID: data.ID,
            P_STATUS: status,
            SEND_EMAIL_TO: data.U_EMAIL
        }
        update(newData,`updateProductByAdmin/`+newData.ID);
        
        // console.log('status ------>', newData);

    };

    return (
        <center>
            <div style={{ margin: 0, height: '100%', width: '95%' }} className='contentPage'>
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
                            <div className='TP_text_product_seller' style={{ color: '#333' }} >
                                <h2>ขออภัย</h2>
                                <p>ผู้ขายไม่ได้อัพโหลดภาพสินค้า</p>
                                <Empty />
                            </div>


                        )}
                    </div>

                    <div className='product_container_text' style={{ color: '#555' }}>
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
                        <div className='TP_text_product' style={{ backgroundColor: '#00000015' }}>
                            {data.P_TEXT}
                        </div>
                        <div className='TP_text_product_seller'>
                            ลงประกาศขายเมื่อ {data.P_POST}
                        </div>
                        <div className='TP_text_product_seller'>
                            ประกาศขายโดย : {data.U_EMAIL}
                        </div>
                    </div>
                </div>
                <div style={{ margin: '1rem', padding: '20px', boxShadow: '0 -5px 5px #00000010', borderRadius: '10px' }}>
                    <h1 style={{ color: '#333', marginTop: '0px' }}> อัพเดตรายการประกาศขาย </h1>
                    <div className='container_btn_select' style={{ margin: '0rem', backgroundColor: '#00000015',padding:'20px' }}>
                        <button className='btn_Yellow' onClick={() => hendle_update_status('รอตรวจสอบ')}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img className='icon_in_btn' src='ICON/Icon_Padding.png' />
                                <div style={{ display: 'block' }}>
                                    <p className='text_in_btn'> รออนุมัติ </p>
                                </div>
                            </div>
                        </button>
                        <button className='btn_Green' onClick={() => hendle_update_status('กำลังประกาศขาย')} >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img className='icon_in_btn' src='ICON/Icon_Accepted.png' />
                                <div style={{ display: 'block' }}>
                                    <p className='text_in_btn'>อนุมัติประกาศขาย</p>
                                </div>
                            </div>
                        </button>
                        <button className='btn_Pink' onClick={() => hendle_update_status('ยกเลิกประกาศขาย')} >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img className='icon_in_btn' src='ICON/Icon_Reject.png' />
                                <div style={{ display: 'block' }}>
                                    <p className='text_in_btn'>ไม่การอนุมัติประกาศขาย</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </center>
    )
}

import React, { useEffect, useRef, useState } from 'react';
import '../css/Login.css';
import '../css/checkbox.css';
import '../css/MyProduct.css';
import { Image } from 'antd';
import { getUserByID, fetchCategories, fillter_product, getProductByID, Check_Token, update, getProductBy_EmailUser } from '../component/system/HTTP_Request ';
import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Alert text --> npm install sweetalert2
import { Space, Table, Tag, Segmented } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityIcon from '@mui/icons-material/Visibility';

const url_backend = 'http://localhost:3000'

function format_Price(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function MyProduct() {
    // Check_Token(); 

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
    type DataIndex = keyof DataType;
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
            // render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.ID - b.ID,
            defaultSortOrder: 'descend', // ค่าเริ่มต้นให้แสดงใหม่กว่าไว้ด้านบน
        },
        {
            title: 'ชื่อสินค้า',
            className: 'TP_font',
            dataIndex: 'P_NAME',
            key: 'P_NAME',
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
            sorter: (a, b) => a.P_NAME.localeCompare(b.P_NAME), // เปรียบเทียบ string
            ...getColumnSearchProps('P_POST'),
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
            render: (_, record) => (

                record.P_STATUS === "กำลังประกาศขาย" ? (
                    <Space size="small" style={{ textAlign: 'center' }}>
                        <button onClick={() => window.location.href = url_backend + '/Product/' + record.ID}><VisibilityIcon /></button>
                        <button
                            onClick={async () => {
                                Swal.fire({
                                    title: 'คุณแน่ใจหรือไม่ว่าต้องการปิดประกาศการขายนี้?',
                                    text: "หากปิดแล้วจะไม่สามารถแก้ไขได้อีก",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: 'green',
                                    cancelButtonColor: '#d33',
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        await update({ 'P_STATUS': 'ยกเลิกประกาศขาย' }, 'updateProduct/' + record.ID);
                                        const updatedProducts = products.filter(item => item.ID !== record.ID);
                                        setProducts(updatedProducts);
                                        Listdata();
                                    }
                                })

                            }}
                        >
                            <DeleteIcon />
                        </button>
                        <button><CampaignIcon /></button>
                    </Space>
                ) : record.P_STATUS === "รอตรวจสอบ" ? (
                    <Space size="small">
                        <button onClick={() => window.location.href = url_backend + '/Product/' + record.ID}><VisibilityIcon /></button>
                        <button onClick={() => window.location.href = url_backend + '/EditProduct/' + record.ID}><EditIcon /></button>
                        <button
                            onClick={async () => {
                                Swal.fire({
                                    title: 'คุณแน่ใจหรือไม่ว่าต้องการปิดประกาศการขายนี้?',
                                    text: "หากปิดแล้วจะไม่สามารถแก้ไขได้อีก",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: 'green',
                                    cancelButtonColor: '#d33',
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        await update({ 'P_STATUS': 'ยกเลิกประกาศขาย' }, 'updateProduct/' + record.ID);
                                        const updatedProducts = products.filter(item => item.ID !== record.ID);
                                        setProducts(updatedProducts);
                                        Listdata();
                                    }
                                })
                            }}
                        >
                            <DeleteIcon />
                        </button>
                    </Space >
                ) : (
                    <Space size="small">
                        <button onClick={() => window.location.href = url_backend + '/Product/' + record.ID}><VisibilityIcon /></button>
                    </Space>
                )
            ),
        },
    ];


    function handleEditbtn() { }
    function handleDelete() {
        // let data = { 'P_STATUS': 'ยกเลิกประกาศขาย' };
        // update(data, 'updateProduct/' + ID_when_click);
        // window.location.reload();
    }
    function handleAds() { }


    const [products, setProducts] = useState<DataType[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>('รายการที่กำลังประกาศขาย');
    const [filteredProducts, setFilteredProducts] = useState<DataType[]>(products);


    //----------------- ดึงสินค้าที่ตรงกับ User ----------------------------
    const userEmail: any = localStorage.getItem('email');
    async function Listdata() {
        setProducts(await getProductBy_EmailUser({ email: userEmail }));
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

    return (
        <center>
            <div style={{ height: '80vh', width: '90%' }} className='contentPage'>
                <h1 className='topics_table'>  รายการประกาศขาย </h1>

                <div style={{ padding: '0px 40px' }}>
                    <Segmented
                        block
                        options={['รายการที่กำลังประกาศขาย', 'รายการที่รออนุมัติ', 'รายการที่ยกเลิกประกาศขาย', 'รายการทั้งหมด']}
                        onChange={newTab => setSelectedTab(newTab as string)}
                        className='tp_tab'
                    />
                    <Table
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
        </center>
    );
}

export default MyProduct;

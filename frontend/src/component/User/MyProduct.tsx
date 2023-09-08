import '../../css/Login.css';
import '../../css/checkbox.css';
import '../../css/MyProduct.css';
import Swal from 'sweetalert2';
import type { InputRef } from 'antd';
import { Button, Input, } from 'antd';
import EditIcon from '@mui/icons-material/Edit';
import { SearchOutlined } from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from 'react';
import { Space, Table, Tag, Segmented } from 'antd';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { Check_Token, update, getProductBy_EmailUser } from '../WebSystem/HTTP_Request ';

const url = 'http://localhost:3000'

function format_Price(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function MyProduct() {
    Check_Token();
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
        P_ADS: Boolean;
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
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            className: 'TP_font',
            dataIndex: 'ID',
            key: 'ID',
            width: '80px',
            fixed: 'left',
            sorter: (a, b) => a.ID - b.ID,
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
            render: (_, record) => (
                record.P_STATUS === "กำลังประกาศขาย" ? (
                    <Space size="small" style={{ textAlign: 'center' }}>
                        <button className='btn_show' onClick={() => window.location.href = url + '/Product/' + record.ID}><VisibilityIcon /></button>
                        <button
                            className='btn_delete'
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

                        {record.P_ADS === true ? (
                            <button className='btn_ads_true' onClick={() => handleAds(record)}><CampaignIcon /></button>
                        ) : (<button className='btn_ads' onClick={() => handleAds(record)}><CampaignIcon /></button>)
                        }
                    </Space>
                ) : record.P_STATUS === "รอตรวจสอบ" ? (
                    <Space size="small">
                        <button className='btn_show' onClick={() => window.location.href = url + '/Product/' + record.ID}><VisibilityIcon /></button>
                        <button className='btn_edit_table' onClick={() => window.location.href = url + '/EditProduct/' + record.ID}><EditIcon /></button>
                        <button
                            className='btn_delete'
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
                        <button className='btn_show' onClick={() => window.location.href = url + '/Product/' + record.ID}><VisibilityIcon /></button>
                    </Space>
                )
            ),
        },
    ];
    function handleAds(data: DataType) {
        const newData = {
            ID: data.ID,
            P_IMG: data.P_IMG,
            P_NAME: data.P_NAME,
            P_PRICE: data.P_PRICE,
            P_TYPE: data.P_TYPE,
            P_ADS: data.P_ADS
        }
        localStorage.setItem('DataProduct_Ads', JSON.stringify(newData));
        window.location.href = url + '/Advert';
    }
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

    const data: DataType[] = filteredProducts; //ขอมูลที่จะแสดงใน ตาราง
    return (
        <center>
            <div style={{ height: 'fit-content', width: '90%', paddingBottom: '7rem' }} className='contentPage'>
                <h1 className='topics_table'>  รายการประกาศขาย </h1>
                <div className='div_cover_table_and_tab'>
                    <Segmented
                        block
                        options={['รายการที่กำลังประกาศขาย', 'รายการที่รออนุมัติ', 'รายการที่ยกเลิกประกาศขาย', 'รายการทั้งหมด']}
                        onChange={newTab => setSelectedTab(newTab as string)}
                        className='tp_tab'
                    />
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
        </center>
    );
}
export default MyProduct;

import { useEffect, useRef, useState } from 'react';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminCheckProduct.css';

import Swal from 'sweetalert2';
import type { InputRef } from 'antd';
import { Space, Table, Tag, Image } from 'antd';
import { Button, Input, Segmented, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { update, ListAllAds, DeleteByID } from '../WebSystem/HTTP_Request ';

interface DataType {
    key: number;
    ID: number;
    P_ID: number;
    Ad_IMG: string;
    Ad_CHECKED: Boolean;
    Ad_CREATE_BILL: string;
}
type DataIndex = keyof DataType;

function AdminCheckAds() {
    // Check_Token(); //admin ไม่จำเป็นจะต้องตรวจสอบก็ได้
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
            align: 'center',
            dataIndex: 'ID',
            key: 'ID',
            width: '80px',
            fixed: 'left',
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: 'ID ของประกาศขาย',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'P_ID',
            key: 'P_ID',
            // fixed: 'left',
            ...getColumnSearchProps('P_ID'),
            sorter: (a, b) => a.P_ID - b.P_ID,
        },
        {
            title: 'วันที่ทำรายการ',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'Ad_CREATE_BILL',
            key: 'Ad_CREATE_BILL',
            sorter: (a, b) => a.Ad_CREATE_BILL.localeCompare(b.Ad_CREATE_BILL), // เปรียบเทียบ string
            ...getColumnSearchProps('Ad_CREATE_BILL'),
        },
        {
            title: 'สถานะการตรวจสอบ',
            className: 'TP_font',
            dataIndex: 'Ad_CHECKED',
            key: 'Ad_CHECKED',
            width: '200px',
            align: 'center',
            render: (_, record) => (
                record.Ad_CHECKED === true ? (
                    <Tag color="green" className='TP_font'> ได้รับการตรวจสอบแล้ว </Tag>
                ) : (
                    <Tag color="gold" className='TP_font'> ยังไม่ตรวจสอบ </Tag>
                )
            )
        },
        {
            title: 'หลักฐานการทำรายการ',
            className: 'TP_font',
            align: 'center',
            key: 'action',
            // width: '60px',
            render: (_, record) => (
                <Space size="small">
                    <Image src={record.Ad_IMG} style={{ height: '50px' }} />
                </Space>
            )
        },
        {
            title: '',
            key: 'action',
            width: '190px',
            render: (_, record) => (
                record.Ad_CHECKED === false ? (
                    <>
                        <button className='btn_ads_true' onClick={() => btn_action(true, record.ID)} style={{ height: '50px', width: '80px' }} > อนุมัติ </button>
                        <button className='btn_delete' onClick={() => btn_action(false, record.ID)} style={{ height: '50px', width: '80px', marginLeft: '10px' }} > ไม่อนุมัติ </button>
                    </>
                ) : (
                    <button className='btn_delete' onClick={() => btn_action(false, record.ID)} style={{ height: '50px', width: '100%' }} > ยกเลิกการโฆษณา </button>
                )
            )
        },
    ];
    const btn_action = (action: Boolean, id: number) => {
        if (action === true) {
            update({ Ad_CHECKED: true }, 'updateAdvert/' + id)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'คุณกำลังจะลบรายการโฆษณา',
                text: 'หากดำเนินการต่อ ระบบจะยกเลิกการโฆษณาของลูกค้า',
                showCancelButton: true,
                confirmButtonText: 'OK 🗑️',
            }).then((result) => {
                if (result.isConfirmed) {
                    DeleteByID(id, 'deleteAdvert');
                    Swal.fire('ยกเลิกรายการโฆษณา เสร็จสิ้น', '', 'success')

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
        }
    }
    const [DataAds, setAds] = useState<DataType[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>('รายการที่ยังไม่ตรวจสอบ');
    const [filteredAds, setFilteredAds] = useState<DataType[]>(DataAds);
    const all_data_Ads = async () => {
        const data: any = await ListAllAds();
        setAds(data);
    }
    useEffect(() => {
        all_data_Ads();
    }, []);
    useEffect(() => {
        const filteredData = DataAds.filter(item => {
            if (selectedTab === 'รายการที่ตรวจสอบแล้ว') {
                return item.Ad_CHECKED === true;
            } else if (selectedTab === 'รายการที่ยังไม่ตรวจสอบ') {
                return item.Ad_CHECKED === false;
            }
            return true;
        });
        setFilteredAds(filteredData as any);
    }, [selectedTab, DataAds]);
    const data: DataType[] = filteredAds; //ขอมูลที่จะแสดงใน ตาราง
    return (
        <center>
            <div style={{ height: '75vh', width: '90%', paddingBottom: '7rem' }} className='contentPage'>
                <h1 className='topics_table'>  ตรวจสอบรายการโฆษณา </h1>
                <div className='div_cover_table_and_tab'>
                    <Segmented
                        block
                        options={['รายการที่ยังไม่ตรวจสอบ', 'รายการที่ตรวจสอบแล้ว', 'รายการทั้งหมด']}
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
export default AdminCheckAds;

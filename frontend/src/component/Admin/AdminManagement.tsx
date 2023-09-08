import { useEffect, useRef, useState } from 'react';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';

import Swal from 'sweetalert2';
import { Space, Table } from 'antd';
import type { InputRef } from 'antd';
import { Button, Input, } from 'antd';
import CreateAdmin from '../Admin/CreateAdmin'
import EditIcon from '@mui/icons-material/Edit';
import { SearchOutlined } from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { listAdmins, DeleteByID } from '../WebSystem/HTTP_Request ';
import type { FilterConfirmProps } from 'antd/es/table/interface';

const url = 'http://localhost:3000'
const Root_Email = "yakkai.th@gmail.com"

function AdminManagement() {
    // Check_Token();
    interface DataType {
        key: number,
        ID: number,
        U_NAME: string,
        U_PHONE: string,
        U_EMAIL: string,
        U_GENDER: string,
        ABOUT_ME: string,
        U_IMG: string,
        U_REGISTER: string
    }
    type DataIndex = keyof DataType
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
            title: 'โปรไฟล์',
            className: 'TP_font',
            key: 'U_IMG',
            width: '80px',
            render: (_, record) => (<img src={record.U_IMG} style={{ width: '50px' }} />)
        },
        {
            title: 'ชื่อ',
            className: 'TP_font',
            dataIndex: 'U_NAME',
            key: 'U_NAME',
            ...getColumnSearchProps('U_NAME'),
        },
        {
            title: 'Email',
            className: 'TP_font',
            dataIndex: 'U_EMAIL',
            key: 'U_EMAIL',
            ...getColumnSearchProps('U_EMAIL'),
        },
        {
            title: 'ติดต่อ',
            className: 'TP_font',
            dataIndex: 'U_PHONE',
            key: 'U_PHONE',
            ...getColumnSearchProps('U_PHONE'),
        },
        {
            title: 'วันที่ลงทะเบียน',
            className: 'TP_font',
            dataIndex: 'U_REGISTER',
            key: 'U_REGISTER',
            ...getColumnSearchProps('U_REGISTER'),
        },
        {
            title: '',
            key: 'action',
            width: '80px',
            render: (_, record: any) => (
                localStorage.getItem('email') === Root_Email ? (
                    record.U_EMAIL === localStorage.getItem("email") ? (
                        <Space size="small" style={{ textAlign: 'center' }}>
                            <button className='btn_edit_table' onClick={() => window.location.href = url + '/MyProfile'}><EditIcon /></button>
                        </Space>
                    ) : (
                        <Space size="small" style={{ textAlign: 'center' }}>
                            <button className='btn_delete' onClick={() => handleDelete(record)}><DeleteIcon /></button>
                        </Space>
                    )
                ) : (
                    record.U_EMAIL === localStorage.getItem("email") ? (
                        <Space size="small" style={{ textAlign: 'center' }}>
                            <button className='btn_edit_table' onClick={() => window.location.href = url + '/MyProfile'}><EditIcon /></button>
                        </Space>
                    ) : (
                        <Space size="small">
                        </Space>
                    )
                )
            ),
        },
    ];

    function handleDelete(data: any) {
        Swal.fire({
            title: 'คุณต้องการลบข้อมูลผู้ใช้ใช่ไหม',
            text: "เมื่อลบข้อมูล จะไม่สามารถกู้คืนข้อมูลได้อีก",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#green',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteByID(data.ID, 'deleteUser') //ลบข้อมูลผู้ใช้งาน
                DeleteByID(data.userLogins.ID, 'deleteLogin') //ลบข้อมูล login ของผู้ใช้งาน
                window.location.reload();
            }
        })
    }
    const [Admin, setAdmin] = useState<DataType[]>([]);
    const [OpenAddAdmin, setOpenAddAdmin] = useState(false);
    const [HeightPage, setHeightPage] = useState('28rem'); //กำหนดขนาดของ marginTop ครับผม!!!

    async function Listdata() {
        setAdmin(await listAdmins());
    }
    useEffect(() => {
        Listdata();
        if (OpenAddAdmin) {
            setHeightPage('2rem');
        } else {
            setHeightPage('28rem');
        }
    }, [OpenAddAdmin]);

    function show_addAdmin() {
        setOpenAddAdmin(prevState => !prevState);
    }
    return (
        <center>
            <div style={{ height: 'fit-content', width: '90%', marginBottom: HeightPage }} className='contentPage'>
                <h1 className='topics_table' style={{ backgroundColor: '#00000020', padding: '10px 50px', border: '5px solid #00000008' }}>  จัดการผู้ดูแลระบบ </h1>
                <div className='div_cover_table_and_tab'>
                    <Table
                        scroll={{ x: 1300 }}
                        columns={columns}
                        dataSource={Admin.map(item => ({ ...item, key: item.ID }))}
                        // scroll={{ y: 750 }}
                        size='middle'
                        bordered
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                            position: ['bottomCenter'],
                            className: 'TP_pagination_table'
                        }}
                    />
                </div>
                {OpenAddAdmin && (
                    <div style={{ width: '95%', marginTop: '2rem', borderRadius: '20px' }}>
                        <CreateAdmin />
                    </div>
                )}
                {localStorage.getItem('email') === Root_Email && (
                    < button onClick={show_addAdmin} className='btn_add_admin' style={{ marginTop: '2rem' }}>
                        {OpenAddAdmin === false ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }} >
                                <img style={{ width: '30px' }} src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2Fadd-admain.png?alt=media&token=4a6f2a62-eec7-4b35-9c43-5744b2c8c56e' />
                                <div style={{ marginLeft: '1rem' }}> เพิ่มบัญชีผู้ดูแลระบบ </div>
                            </div>
                        ) : (
                            <div style={{ marginLeft: '1rem' }}> ปิดการเพิ่มบัญชีผู้ดูแลระบบ </div>
                        )}
                    </button>
                )}
            </div>
        </center >
    );
}
export default AdminManagement;

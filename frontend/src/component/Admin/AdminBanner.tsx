import { useEffect, useState } from 'react';
import '../../css/checkbox.css';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminCheckProduct.css';
import '../../css/AdminManageTable.css';

import { Space, Table, Image } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { submit, DeleteByID, listData } from '../system/HTTP_Request ';
import Swal from 'sweetalert2';
import { DeleteOutlined } from '@mui/icons-material';
import AdminSideBanner from './AdminSideBanner';

function AdminTopBanner() {
    interface TopBanner { ID: number, TB_LINK: string, TB_IMG: string }
    const [AllTopBanner, setTopBanner] = useState<TopBanner[]>([]);
    const [TB_LINK, setTB_LINK] = useState('');
    const [TB_IMG, setTB_IMG] = useState('');
    const [OpenCreateTopBanner, setOpenCreateTopBanner] = useState(false);

    const listAllData = async () => {
        const dataCategory = await listData('listTopBanner');
        if (dataCategory) {
            setTopBanner(dataCategory);
        }
    }
    useEffect(() => {
        listAllData();
    }, [AllTopBanner]);

    const columns: ColumnsType<TopBanner> = [
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
            title: 'ภาพที่ใช้',
            className: 'TP_font',
            align: 'center',
            width: '300px',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Image src={record.TB_IMG} style={{ height: '50px', width: '150px', objectFit: 'cover', borderRadius: '10px' }} />
                </Space>
            )
        },
        {
            title: 'ลิงค์ที่เชื่อมโยง',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'TB_LINK',
            key: 'TB_LINK',

        },
        {
            title: <>
                <button className='btn_manageTable' onClick={() => setOpenCreateTopBanner(!OpenCreateTopBanner)} style={{ fontSize: '15px', width: '100%' }}>
                    {!OpenCreateTopBanner ? <PlusOutlined style={{ fontSize: '38px' }} /> : <CloseOutlined style={{ fontSize: '38px' }} />}
                </button>
            </>,
            key: 'action',
            align: 'center',
            width: '100px',
            render: (_, record) => (
                <button onClick={() => handleDelete(record)} className='btn_delete' style={{ height: '45px', width: '80px', borderRadius: '10px' }} > <DeleteOutlined /> </button>
            )
        },
    ];

    const handleDelete = (data: TopBanner) => {
        Swal.fire({
            title: 'คุณกำลังลบรายการสำคัญ',
            html: ` หากดำเนินการต่อจะเป็นการลบภาพ Banner <br/> ออกจากระบบอย่างถาวร`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            showLoaderOnConfirm: true,
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteByID(data.ID, 'deleteTopBanner');

            }
        })
    };

    const hendle_Create_Category = () => {
        let TopBanner = {
            TB_LINK: TB_LINK,
            TB_IMG: TB_IMG
        }
        if (TB_IMG === '') {
            Swal.fire({
                title: 'คุณยังกรอกข้อมูลไม่ครบถ้วน',
                html: ` โปรดตรวจสอบและดำเนินการอีกครั้ง`,
                icon: 'warning',
                showCancelButton: false,
                showLoaderOnConfirm: true,
            })
        } else {
            submit(TopBanner, 'createTopBanner');
            setOpenCreateTopBanner(!OpenCreateTopBanner);
            setTB_IMG('');
            setTB_LINK('');
        }
    }

    return (
        <center>
            <div style={{ height: 'fit-content', width: '90%', minHeight: 'fit-content' }} className='contentPage'>
                <h1 className='topics_table'>  จัดกการโฆษณา ด้านบน </h1>
                {OpenCreateTopBanner && (
                    <div className='container_manageTable' style={{ padding: '20px', display: 'block' }}>
                        <div id='Card_Cat' className='Card_Cat' style={{ width: '85%', height: '300px', marginBottom: '1rem', padding: '5px' }} >
                            <img src={TB_IMG} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                        </div>
                        <p style={{ fontSize: '12px', textAlign: 'right', width: '85%' }} > * โปรดทราบ ขนาดของภาพที่เหมาะสมคือ 1800 : 500 (px) </p>

                        <div className='input_container_admin_manageTable'>
                            <p className='P_label_input' style={{ marginTop: 0 }}> ที่อยู่ภาพ : </p>
                            <input className='input_manage' type="text" value={TB_IMG} placeholder="กรุณากรอก URL รูปภาพ" onChange={(event) => setTB_IMG(event.target.value)} />
                            <p className='P_label_input'> Link เชื่อมโยง : </p>
                            <input className='input_manage' type="text" value={TB_LINK} placeholder="กรุณากรอก ลิงค์ที่ต้องการให้เชื่อมโยงไปเมื่อกด" onChange={(event) => setTB_LINK(event.target.value)} />
                        </div>
                        <div className='btn_add_cat' style={{ marginTop: '2rem' }}>
                            <button className='btn_manageTable' onClick={hendle_Create_Category} > เพิ่มรายการ </button>
                        </div>
                    </div>
                )}
                <div style={{ width: '80%' }}>
                    <Table
                        // scroll={{ x: 1300 }}
                        columns={columns}
                        dataSource={AllTopBanner.map(item => ({ ...item, key: item.ID }))}
                        size='middle'
                        bordered
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: false,
                            position: ['bottomCenter'],
                            className: 'TP_pagination_table'
                        }}
                    />
                </div>
            </div>

            {AdminSideBanner()}

        </center >
    );
}
export default AdminTopBanner;

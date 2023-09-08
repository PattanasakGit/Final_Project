import { useEffect, useState } from 'react';

import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminManageTable.css';
import '../../css/AdminCheckProduct.css';

import Swal from 'sweetalert2';
import { Space, Table, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@mui/icons-material';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { submit, DeleteByID, listData } from '../WebSystem/HTTP_Request ';

function AdminSideBanner() {
    interface SideBanner { ID: number, SB_LINK: string, SB_IMG: string }
    const [AllSideBanner, setSideBanner] = useState<SideBanner[]>([]);
    const [SB_LINK, setSB_LINK] = useState('')
    const [SB_IMG, setSB_IMG] = useState('');
    const [OpenCreateSideBanner, setOpenCreateSideBanner] = useState(false);

    const listAllData = async () => {
        const dataSideBanner = await listData('listSideBanner');
        if (dataSideBanner) {
            setSideBanner(dataSideBanner);
        }
    }

    useEffect(() => {
        listAllData();
    }, [AllSideBanner]);

    const columns: ColumnsType<SideBanner> = [
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
            title: 'ภาพโฆษณาที่ใช้',
            className: 'TP_font',
            align: 'center',
            width: '300px',
            key: 'action',
            // width: '60px',
            render: (_, record) => (
                <Space size="small">
                    <Image src={record.SB_IMG} style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                </Space>
            )
        },
        {
            title: 'ลิงค์ที่เชื่อมโยง',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'SB_LINK',
            key: 'SB_LINK',
        },
        {
            title: <>
                <button className='btn_manageTable' onClick={() => setOpenCreateSideBanner(!OpenCreateSideBanner)} style={{ fontSize: '15px', width: '100%' }}>
                    {!OpenCreateSideBanner ? <PlusOutlined style={{ fontSize: '38px' }} /> : <CloseOutlined style={{ fontSize: '38px' }} />}
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
    const handleDelete = (data: SideBanner) => {
        Swal.fire({
            title: 'คุณกำลังลบรายการสำคัญ',
            html: ` หากดำเนินการต่อจะเป็นการลบภาพ Banner <br/> ออกจากระบบอย่างถาวร`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            showLoaderOnConfirm: true,
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteByID(data.ID, 'deleteSideBanner');
            }
        })
    };

    const hendle_Create_SideBanner = () => {
        let SideBanner = {
            SB_LINK: SB_LINK,
            SB_IMG: SB_IMG
        }
        if (SB_IMG === '') {
            Swal.fire({
                title: 'คุณยังกรอกข้อมูลไม่ครบถ้วน',
                html: ` โปรดตรวจสอบและดำเนินการอีกครั้ง`,
                icon: 'warning',
                showCancelButton: false,
                showLoaderOnConfirm: true,
            })
        } else {
            submit(SideBanner, 'createSideBanner');
            setOpenCreateSideBanner(!OpenCreateSideBanner);
            setSB_IMG('');
            setSB_LINK('');
        }
    }

    return (
        <center>
            <div style={{ height: 'fit-content', width: '90%', minHeight: 'fit-content' }} className='contentPage'>
                <h1 className='topics_table'>  จัดกการโฆษณา ด้านล่าง </h1>
                {OpenCreateSideBanner && (
                    <div className='container_manageTable' style={{ padding: '20px' }}>
                        <div style={{ width: '30%' }} >
                            <img src={SB_IMG} className='Card_Cat' style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px' }} />
                            <p style={{ fontSize: '12px', color: '#fff' }} > * โปรดทราบ อัตราส่วนของภาพที่เหมาะสมคือ 1 : 1 </p>
                        </div>

                        <div className='input_container_admin_manageTable' >
                            <p className='P_label_input' style={{ marginTop: 0 }}> ที่อยู่ภาพ : </p>
                            <input className='input_manage' type="text" value={SB_IMG} placeholder="กรุณากรอก URL รูปภาพ" onChange={(event) => setSB_IMG(event.target.value)} />
                            <p className='P_label_input'> Link เชื่อมโยง : </p>
                            <input className='input_manage' type="text" value={SB_LINK} placeholder="กรุณากรอก ลิงค์ที่ต้องการให้เชื่อมโยงไปเมื่อกด" onChange={(event) => setSB_LINK(event.target.value)} />
                        </div>
                        <div className='btn_add_cat' style={{ marginTop: '2rem' }}>
                            <button className='btn_manageTable' onClick={hendle_Create_SideBanner} > เพิ่มรายการ </button>
                        </div>
                    </div>
                )}
                <div style={{ width: '80%' }}>
                    <Table
                        // scroll={{ x: 1300 }}
                        columns={columns}
                        dataSource={AllSideBanner.map(item => ({ ...item, key: item.ID }))}
                        // scroll={{ y: 750 }}
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
        </center >
    );
}
export default AdminSideBanner;

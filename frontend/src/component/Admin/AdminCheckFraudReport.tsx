import { useEffect, useState } from 'react';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminCheckProduct.css';
import '../../css/AdminManageTable.css';

import Swal from 'sweetalert2';
import { Space, Table, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import DeleteIcon from '@mui/icons-material/Delete';
import { listData, DeleteByID } from '../WebSystem/HTTP_Request ';

function CheckFraudReport() {
    interface Category { ID: number, SELLER: string, EMAIL_REPORTER: string, INFORMATIONS: string, IMG_FRAUD_REPORT: string }
    const [AllFraudReport, setAllFraudReport] = useState<Category[]>([]);

    const listAllData = async () => {
        const dataFraudReport = await listData('listFRAUD_REPORT');
        if (dataFraudReport) {
            setAllFraudReport(dataFraudReport);
        }
    }
    useEffect(() => {
        listAllData();
    }, [AllFraudReport]);

    const columns: ColumnsType<Category> = [
        {
            title: 'ID',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'ID',
            key: 'ID',
            width: '80px',
            fixed: 'left',
            sorter: (a, b) => a.ID - b.ID,
            defaultSortOrder: 'descend', 
        },
        {
            title: 'ผู้ที่ถูกรายงาน',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'SELLER',
            key: 'SELLER',
            width: '250px',
        },
        {
            title: 'ผู้รายงาน',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'EMAIL_REPORTER',
            key: 'EMAIL_REPORTER',
            width: '250px',
        },
        {
            title: 'เรื่อง',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'INFORMATION',
            key: 'INFORMATION',
            width: '300px',
        },
        {
            title: 'รายละเอียด',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'INFORMATION',
            key: 'INFORMATION',
        },
        {
            title: 'หลักฐานประกอบ',
            className: 'TP_font',
            align: 'center',
            width: '200px',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Image src={record.IMG_FRAUD_REPORT} style={{ height: '100px' }} />
                </Space>
            )
        },
        {
            title: '',
            className: 'TP_font',
            align: 'center',
            width: '100px',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <button
                        className='btn_delete'
                        onClick={async () => {
                            Swal.fire({
                                title: 'คุณแน่ใจหรือไม่ว่าต้องการลบ?',
                                text:'การลบรายงานการโกง จะไม่สามารถกู้คืนได้อีก',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: 'green',
                                cancelButtonColor: '#d33',
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    await DeleteByID(record.ID, 'deleteFRAUD_REPORT');
                                }
                            })
                        }}
                    >
                        <DeleteIcon />
                    </button>
                </Space>
            )
        },
    ];
    return (
        <center>
            <div style={{ height: 'auto', width: '98%' }} className='contentPage'>
                <h1 className='topics_table'>  รายงานการโกง </h1>
                <div style={{ width: '98%' }}>
                    <Table
                        scroll={{ x: 1300 }}
                        columns={columns}
                        dataSource={AllFraudReport.map(item => ({ ...item, key: item.ID }))}
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
export default CheckFraudReport;

import React, { useEffect, useRef, useState } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminCheckProduct.css';
import '../../css/AdminManageTable.css';

import { Space, Table, Image, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { listData } from '../system/HTTP_Request ';

const url = 'http://localhost:3000'

function CheckFraudReport() {
    interface Category { ID: number, SELLER: string, EMAIL_REPORTER: string ,INFORMATIONS: string,IMG_FRAUD_REPORT: string}
    const [AllFraudReport, setAllFraudReport] = useState<Category[]>([]);
    const [SELLER, setSELLER] = useState('');
    const [EMAIL_REPORTER, setEMAIL_REPORTER] = useState('');
    const [INFORMATIONS, setINFORMATIONS] = useState('');
    const [IMG_FRAUD_REPORT, setIMG_FRAUD_REPORT] = useState('');

    const listAllData = async () => {
        const dataFraudReport = await listData('listFRAUD_REPORT');
        if (dataFraudReport) {
            setAllFraudReport(dataFraudReport);
            setSELLER(dataFraudReport.SELLER);
            setEMAIL_REPORTER(dataFraudReport.EMAIL_REPORTER);
            setINFORMATIONS(dataFraudReport.INFORMATIONS);
            setIMG_FRAUD_REPORT(dataFraudReport.IMG_FRAUD_REPORT);
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
        },
        {
            title: 'ผู้ที่ถูกรายงาน',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'SELLER',
            key: 'SELLER',

        },
        {
            title: 'ผู้รายงาน',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'EMAIL_REPORTER',
            key: 'EMAIL_REPORTER',

        },
        {
            title: 'ข้อมูลเพิ่มเติม',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'INFORMATIONS',
            key: 'INFORMATIONS',
            width: '800px',

        },
        {
            title: 'หลักฐานประกอบ',
            className: 'TP_font',
            align: 'center',
            width: '300px',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Image src={record.IMG_FRAUD_REPORT} style={{ height: '100px' }} />
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

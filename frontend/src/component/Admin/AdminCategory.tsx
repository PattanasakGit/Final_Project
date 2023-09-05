import React, { useEffect, useRef, useState } from 'react';
import '../../css/Login.css';
import '../../css/checkbox.css';
import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';
import '../../css/AdminCheckProduct.css';
import '../../css/AdminManageTable.css';

import { Space, Table, Image, Empty } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Check_Token, submit, fetchCategories, DeleteByID } from '../system/HTTP_Request ';
import Swal from 'sweetalert2';
import { DeleteOutlined } from '@mui/icons-material';

const url = 'http://localhost:3000'

function AdminCategory() {
    interface Category { ID: number, CP_NAME: string, CP_ICON: string }
    const [AllCategory, setAllCategory] = useState<Category[]>([]);
    const [NameCategory, setNameCategory] = useState('');
    const [ImgCategory, setImgCategory] = useState('');
    const [OpenAddCategory, setOpenAddCategory] = useState(false);

    const listAllData = async () => {
        const dataCategory = await fetchCategories();
        if (dataCategory) {
            setAllCategory(dataCategory);
        }
    }

    useEffect(() => {
        listAllData();
    }, [AllCategory]);

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
            title: 'ICON',
            className: 'TP_font',
            align: 'center',
            width: '100px',
            key: 'action',
            // width: '60px',
            render: (_, record) => (
                <Space size="small">
                    <Image src={record.CP_ICON} style={{ height: '50px' }} />
                </Space>
            )
        },
        {
            title: 'ชื่อหมวดหมู่',
            className: 'TP_font',
            align: 'center',
            dataIndex: 'CP_NAME',
            key: 'CP_NAME',

        },
        {
            title: <>
                <button className='btn_manageTable' onClick={() => setOpenAddCategory(!OpenAddCategory)} style={{ fontSize: '15px', width: '100%' }}>
                    {!OpenAddCategory ? <PlusOutlined style={{ fontSize: '38px' }} /> : <CloseOutlined style={{ fontSize: '38px' }} />}
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


    const handleDelete = (data: Category) => {
        Swal.fire({
            title: 'คุณกำลังลบรายการสำคัญ',
            html: `❗ การลบหมวดหมู่จะส่งผลกระทบต่อรายการสินค้าในระบบ ❗ <br/> โปรดยืนยันการลบโดยการพิมพ์ " ${data.CP_NAME} " `,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            showLoaderOnConfirm: true,
            preConfirm: (input) => {
                return input;
            },
        }).then((result) => {
            if (result.isConfirmed) {

                if (result.value === data.CP_NAME) {
                    DeleteByID(data.ID, 'deleteCategoryProduct');

                } else {
                    Swal.fire({
                        title: 'ลบ ' + `${data.CP_NAME}` + ' ผิดพลาด',
                        icon: 'error'
                    })

                }
            }
        })
    };

    const hendle_Create_Category = () => {
        let category = {
            CP_NAME: NameCategory,
            CP_ICON: ImgCategory
        }
        submit(category, 'createCategoryProduct');
        setOpenAddCategory(!OpenAddCategory);
        setImgCategory('');
        setNameCategory('');
    }

    return (
        <center>
            <div style={{ height: 'auto', width: '90%' }} className='contentPage'>
                <h1 className='topics_table'>  จัดกการหมวดหมู่สินค้า </h1>
                {OpenAddCategory && (
                    <div className='container_manageTable' style={{ padding: '20px' }}>
                        <div id='Card_Cat' className='Card_Cat' style={{ width: '20%' }} >
                            <img src={ImgCategory} />
                            <p> {NameCategory} </p>
                        </div>
                        <div className='input_container_admin_manageTable'>
                            <p className='P_label_input' style={{ marginTop: 0 }}> Icon : </p>
                            <input className='input_manage' type="text" value={ImgCategory}  placeholder="กรุณากรอก URL รูปภาพ" onChange={(event) => setImgCategory(event.target.value)} />
                            <p className='P_label_input'> ชื่อหมวดหมู่ : </p>
                            <input className='input_manage' type="text" value={NameCategory} placeholder="กรุณากรอก ชื่อ หมวดหมู่" onChange={(event) => setNameCategory(event.target.value)} />
                        </div>
                        <div className='btn_add_cat'>
                            <button className='btn_manageTable' onClick={hendle_Create_Category} > เพิ่มหมวดหมู่ </button>
                        </div>
                    </div>
                )}
                <div style={{ width: '80%' }}>
                    <Table
                        // scroll={{ x: 1300 }}
                        columns={columns}
                        dataSource={AllCategory.map(item => ({ ...item, key: item.ID }))}
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

export default AdminCategory;

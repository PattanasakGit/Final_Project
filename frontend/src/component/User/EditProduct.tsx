import '../../css/Product.css';
import '../../css/Background.css';
import Swal from 'sweetalert2';
import { useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import { validateCreateProduct } from "../WebSystem/Validateinput";
import { Button, MenuItem, Select } from '@mui/material';
import { fetchCategories, getProductByID, Check_Token, update } from '../WebSystem/HTTP_Request ';

function EditProduct() {
    Check_Token();
    const { id } = useParams<{ id: any }>();
    const [product, setProduct] = useState<any>({}); // ข้อมูลสินค้าที่ดึงมาจาก API
    const [categories, setCategories] = useState([]);
    const [type, settype] = useState("");
    const [category, setcategory] = useState("");
    const [Oldcategory, setOldcategory] = useState("");
    const [Price, setPrice] = useState("");
    const [nameProduct, setnameProduct] = useState("");
    const [text, setText] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    // สำหรับการอัพโหลลด รูปภาพเข้า FireBase
    const [URL_IMG, setURL_IMG] = useState<any>([]);
    let data = {
        'P_NAME': nameProduct,
        'P_CATEGORY': category,
        'P_PRICE': Price,
        'P_TEXT': text,
        'P_IMG': URL_IMG,
        'P_PHONE': PhoneNumber,
        'P_TYPE': type,
        'U_EMAIL': localStorage.getItem('email')
    }
    useEffect(() => {
        const fetchCategoriesData = async () => {
            const fetchedCategories: any = await fetchCategories(); // ดึงรายการหมวดหมู่จาก backend
            setCategories(fetchedCategories);
        };
        fetchCategoriesData();

        const fetchData = async () => {
            const productData = await getProductByID(id);
            setProduct(productData);
            settype(productData.P_TYPE);
            setOldcategory(productData.P_CATEGORY);
            setPrice(productData.P_PRICE);
            setnameProduct(productData.P_NAME);
            setText(productData.P_TEXT);
            setPhoneNumber(productData.P_PHONE);
            setURL_IMG(productData.P_IMG);
        };
        fetchData();
    }, [id]);

    const handleEditSubmit = async () => {
        if (validateCreateProduct(data).isValid) {  //ผ่าน ไม่มี errors
            update(data, 'updateProduct/' + id);
        } else { //ตรวจพบ errors
            Swal.fire({
                titleText: validateCreateProduct(data).messageErrors[0],
                icon: 'warning',
            })
        }
    };
    const handleSetTextParam = (value: string) => {
        setcategory(value);
    }
    const handleTypeChange = (event: any) => {
        settype(event.target.value);
    };
    function output_can_edit_product() {
        return (
            <center>
                <div className='contentPage' style={{ height: '100%', width: '90%', padding: '20px' }}>
                    <div style={{ display: 'flex' }} className='subcontentPage'>
                        <div style={{ width: '50%' }} className='img_space'>
                            <h1 style={{ textShadow: '-1px -1px 0 rgb(114, 114, 114), 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>รูปภาพของสินค้า</h1>
                            <p style={{ fontSize: '12px', color: '#333' }}>
                                *หมายเหตุ คุณไม่สามารถแก้ไขรูปภาพได้
                            </p>
                            <div className="image-icons">
                                {URL_IMG.map((imgUrl: string, index: number) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        style={{ height: '160px', marginRight: '1rem', borderRadius: '20px' }}
                                        alt={`Image ${index}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ width: '50%', justifyContent: 'flex-end' }} className='text_space'>
                            <h1 style={{ textShadow: '-1px -1px 0 rgb(114, 114, 114), 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}> แก้ไขประกาศขายสินค้า </h1>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <label style={{ fontSize: '16px' }}>ชื่อสินค้า : </label>
                                <input type='string' className='ThepatforInput' placeholder='ชื่อสินค้า'
                                    onChange={(event) => setnameProduct(event.target.value)}
                                    value={nameProduct}
                                    style={{ width: '60%', backgroundColor: '#fff', margin: '5px 5% 5px 1%' }}
                                />
                            </div>

                            <p style={{ color: '#333', margin: '16px 50px 0px 0px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} > หมวดหมู่สินค้าก่อนการแก้ไข: {Oldcategory}</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <label style={{ fontSize: '16px' }}>หมวดหมู่ :</label>
                                <Select value={category} onChange={(event) => handleSetTextParam(event.target.value as string)} className='TP_combobox_search' style={{ width: '62.8%', margin: '5px 5% 5px 1%' }}>
                                    {categories.map((category: any) => (
                                        <MenuItem key={category.ID} value={category.CP_NAME}>
                                            <img src={category.CP_ICON} style={{ height: '30px', width: '30px', marginRight: '1rem' }} />
                                            {category.CP_NAME}
                                        </MenuItem>
                                    ))}
                                </Select><br />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <label className="TP_label"> <input type="radio" value="สินค้ามือ 1" checked={type === 'สินค้ามือ 1'} onChange={handleTypeChange} />
                                    <span className="TP_span" style={{ width: '90px' }}> มือ1 </span>
                                </label>
                                <label className="TP_label"> <input type="radio" value="สินค้ามือ 2" checked={type === 'สินค้ามือ 2'} onChange={handleTypeChange} />
                                    <span className="TP_span" style={{ width: '90px' }}> มือ2 </span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <label style={{ fontSize: '16px' }}>ราคา :</label>
                                <input type='number' className='ThepatforInput' placeholder='ราคาสินค้า'
                                    onChange={(event) => setPrice(event.target.value)}
                                    value={Price}
                                    style={{ width: '60%', backgroundColor: '#fff', margin: '5px 5% 5px 1%' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <label style={{ fontSize: '16px' }}>เกี่ยวกับสินค้า :</label>
                                <textarea className='ThepatforInput' placeholder='รายละเอียดสินค้า'
                                    onChange={(event) => setText(event.target.value)}
                                    value={text}
                                    style={{ width: '60%', minHeight: '200px', backgroundColor: '#fff', resize: 'none', margin: '5px 5% 5px 1%' }}>
                                </textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <label style={{ fontSize: '16px' }}>Tel :</label>
                                <input type='string' className='ThepatforInput' placeholder='เบอร์โทรศัพท์'
                                    onChange={(event) => setPhoneNumber(event.target.value)}
                                    value={PhoneNumber}
                                    style={{ width: '60%', backgroundColor: '#fff', margin: '5px 5% 5px 1%' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <Button variant="contained" className="TP_fun_button" onClick={handleEditSubmit}>
                            แก้ไขประกาศ
                        </Button>
                    </div>
                </div>
            </center>
        );
    }
    function output_no_edit_product() {
        return (
            <center>
                <div className='contentPage' style={{ height: '85vh', width: '90%', padding: '20px' }}>
                    <div className='subcontentPage'>
                        <h1>ขออภัยครับ</h1>
                        <h1>คุณไม่สามารถแก้ไขรายการนี้ได้ เนื่องจากคุณไม่ใช่เจ้าของประกาศนี้</h1>
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FaleartPage.svg?alt=media&token=1be2b5db-b1fc-4663-b56e-02fdee7dc13c'
                            style={{ height: '700px' }}
                        />
                    </div>
                </div>
            </center>
        );
    }

    const user_logint_email: any = localStorage.getItem('email');
    function check_output() {
        if (user_logint_email === product.U_EMAIL) { return output_can_edit_product(); }
        else return output_no_edit_product();
    }
    return (
        <>
            {check_output()}
        </>
    );
}
export default EditProduct;

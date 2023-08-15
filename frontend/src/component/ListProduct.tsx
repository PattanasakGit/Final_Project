import { useState, useEffect, SetStateAction } from 'react';
import { Grid, Card, CardContent, Typography, Pagination } from '@mui/material';
import '../css/Background.css';
import { listProduct, fetchCategories, fillter_product } from './system/HTTP_Request ';
import { Button, Drawer, Radio, Collapse, Tag, Empty } from 'antd'
import { Select, MenuItem } from '@mui/material';
import { margin, padding } from '@mui/system';
const { Panel } = Collapse;
import Product from "./Product"

const colors = ["FF8C32", "D7A86E", "A64B2A", "8E3200"];

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalProducts, setTotalProducts] = useState(0);

  const [type, settype] = useState("");
  const [category, setcategory] = useState("");
  const [minPrice, setminPrice] = useState(0);
  const [maxPrice, setmaxPrice] = useState(0);
  const [nameProduct, setnameProduct] = useState("");

  const [categories, setCategories] = useState([]);
  // const [selectedValue, setSelectedValue] = useState("");
  // const type_new = () => { settype('new') };
  // const type_old = () => { settype('old') };
  const handleTypeChange = (event: any) => {
    settype(event.target.value);
  };

  let data_fiter = {
    "nameProduct": nameProduct,
    "category": category,
    "type": type,
    "minPrice": minPrice,
    "maxPrice": maxPrice
  }

  //================== สำหรับ Drawer ==============================
  const [open, setOpen] = useState(false);
  const showDrawer = () => { setOpen(true); };
  const onClose = () => { setOpen(false); };
  //==============================================================
  useEffect(() => {
    const fetchCategoriesData = async () => {
      const fetchedCategories: any = await fetchCategories(); // ดึงรายการหมวดหมู่จาก backend
      setCategories(fetchedCategories);
    };
    fetchCategoriesData();
    filter_searchProducts();
  }, [currentPage, category]);

  const filter_searchProducts = async () => {
    const pageSize = 24;
    const data = await fillter_product(data_fiter);
    const totalProducts = data.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const productsData = data.slice(startIndex, endIndex);
    setProducts(productsData);
    setTotalProducts(totalProducts);
  };

  //============================================================================
  const Search = () => { //เมื่อกดปุ่มค้นหา
    filter_searchProducts();
    onClose(); //เมื่อกดยืนยัให้ปิด drawer

  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      Search();
    }
  };

  const send_data_to_Product = (data: any) => {
    // localStorage.setItem("Product", JSON.stringify(data));
    window.location.href = '/Product/' + data.ID;
  };

  const handlePageChange = (event: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 515); // เมื่อกดเปลี่ยนหน้าให้เลื่อนขึ้นด้านบนของหน้าเพจ
  };

  const handleSetTextParam = (value: string) => {
    // setParam_for_search('getProductByCATEGORY/' + value);
    // setSelectedValue(value);
    setcategory(value);
    setCurrentPage(1);
    setnameProduct("");
  }

  const btn_for_filter = () => {


  };

  const clear_all_filter = async () => {
    settype('');
    setcategory('');
    setminPrice(0);
    setmaxPrice(0);
    setnameProduct('');

    let blank_data_fiter = {
      "nameProduct": "",
      "category": "",
      "type": "",
      "minPrice": 0,
      "maxPrice": 0
    }

    const pageSize = 24;
    const data = await fillter_product(blank_data_fiter);
    const totalProducts = data.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const productsData = data.slice(startIndex, endIndex);
    setProducts(productsData);
    setTotalProducts(totalProducts);
  };

  const check_price = (price: number) => {
    if (price === 0) {
      return "";
    } else {
      return price;
    }
  }

  // const [selectedCategory, setSelectedCategory] = useState('');
  // const handleCategoryClick = (categoryName:any) => {
  //   setSelectedCategory(categoryName);
  //   handleSetTextParam(categoryName);
  // };

  //------------------------ สำหรับแสดงหมวดหมู่ --------------------------
  const [showAllItems, setShowAllItems] = useState(false);
  const [itemsPerPage_CP, setItemsPerPage_CP] = useState(15);
  // const itemsPerPage_CP = 13;
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth < 576) { // หน้าจอมือถือ (mobile)
        setItemsPerPage_CP(4);
      } else if (windowWidth >= 576 && windowWidth < 992) { // หน้าจอ iPad
        setItemsPerPage_CP(7);
      } else { // หน้าจอ desktop
        setItemsPerPage_CP(15);
      }
    };


    // ตอนที่โหลดหน้าหรือปรับขนาดหน้าจอ
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  //----------------------------------------------------------------











  const handleCategoryClick = (categoryName: any) => {
    handleSetTextParam(categoryName);
    setShowAllItems(false);
    window.scrollTo(0, 515);
  };

  const handleToggleShowAll = () => {
    setShowAllItems((prev) => !prev);
  };

  const getVisibleCategories = () => {
    return showAllItems ? categories : categories.slice(0, itemsPerPage_CP);
  };

  function format_Price(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }


  //============================================================================

  return (
    <div>
      {/* <Button onClick={Drawer_for_search}> ตรวจสอบข้อมูล </Button> */}
      {/* <Button type="primary" onClick={showDrawer}>
        Open
      </Button> */}
      <Drawer title="Filter การค้นหา" placement="left" onClose={onClose} visible={open} style={{ backgroundColor: 'rgba(255, 255, 255, 0.425)', backdropFilter: 'blur(70px)' }} className='TP_header_drawer'>
        {/* <center><Button onClick={clear_all_filter} > ล้าง filter ค้นหา </Button></center> */}
        <h2 className='TP_Text_in_Drawer'> เลือกหมวดหมู่สินค้า </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Select value={category} onChange={(event) => handleSetTextParam(event.target.value as string)} className='TP_combobox_search'>
            <MenuItem key="all" value="">
              <img src={'https://img.icons8.com/?size=512&id=IJNt9jGwqy9N&format=png'} style={{ height: '30px', width: '30px', marginRight: '1rem' }} /> ทั้งหมด
            </MenuItem>
            {categories.map((category: any) => (
              <MenuItem key={category.ID} value={category.CP_NAME}>
                <img src={category.CP_ICON} style={{ height: '30px', width: '30px', marginRight: '1rem' }} />
                {category.CP_NAME}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }} className='TP_Box_radio'>
          <label className="TP_label"> <input type="radio" value="สินค้ามือ 1" checked={type === 'สินค้ามือ 1'} onChange={handleTypeChange} />
            <span className="TP_span">มือ1</span>

          </label>
          <label className="TP_label"> <input type="radio" value="สินค้ามือ 2" checked={type === 'สินค้ามือ 2'} onChange={handleTypeChange} />
            <span className="TP_span">มือ2</span>

          </label>
        </div>
        <div>
          <label style={{ fontSize: '18px', marginBottom: '6px', color: '#333' }}> เงินขั้นต่ำ : </label>
          <input type="number" id="minAmount" placeholder="กรอกเงินขั้นต่ำ" className='ThepatforInput'
            style={{ width: '50%', height: '60%', backgroundColor: 'rgb(255, 255, 255, 0.5)', margin: '1rem', }}
            value={check_price(minPrice)} onChange={(event) => setminPrice(parseInt(event.target.value))}
          />
        </div>

        <div>
          <label style={{ fontSize: '18px', marginBottom: '6px', color: '#333' }}> เงินสูงสุด : </label>
          <input type="number" id="maxAmount" placeholder="กรอกเงินขั้นสูงสุด" className='ThepatforInput'
            style={{ width: '50%', height: '60%', backgroundColor: 'rgb(255, 255, 255, 0.5)', margin: '1rem', marginTop: 0 }}
            value={check_price(maxPrice)} onChange={(event) => setmaxPrice(parseInt(event.target.value))}
          />
        </div>
        <center>
          {Object.values(data_fiter).every((value) => !value) ? (<h1></h1>) : (
            <>
              <h3 style={{ backgroundColor: 'rgba(255, 255, 255, 0.425)', padding: '5px', borderRadius: '5px', color: '#333', fontSize: '18px' }}
              >คุณกำลังใช้งาน Filter เหล่านี้</h3>
              {checkFilter(data_fiter).map((item, index) => (
                <div key={index}>
                  {Object.keys(item).map((key) => (
                    <p key={key} style={{ fontSize: '16px', padding: '6px', margin: '0', backgroundColor: `#${colors[index % colors.length]}`, color: "#FFF", border: "1px solid #fff" }}>
                      {key === "category" ? "หมวดหมู่สินค้า" : key === "type" ? "ประเภทสินค้า" : key === "minPrice" ? "เงินเริ่มต้น" : key === "maxPrice" ? "เงินสูงสุด" : key}
                      : {item[key]}
                    </p>
                  ))}
                </div>
              ))}
            </>
          )}
        </center>
        {/* <center><Button onClick={clear_all_filter} > ล้าง filter ค้นหา </Button></center> */}
        <button onClick={clear_all_filter} className="button-clear-filter">
          🗑️ ล้าง filter ค้นหา
        </button>
        <button onClick={Search} className="button-filter-search">
          ✨ ยืนยัน
        </button>
      </Drawer>


      {/* --------------------------------------- หมวดหมู่ --------------------------------------------------------- */}
      <div className="table_show_products" >
        {/* <div style={{ fontSize: '25px', color: '#333', marginBottom: '1rem' }}>หมวดหมู่สินค้า</div> */}
        <div className="tp-category-container">
          <Card className={`tp-category-card`} onClick={() => handleCategoryClick('')}>
            <img src={'https://img.icons8.com/?size=512&id=IJNt9jGwqy9N&format=png'} className="tp-category-card-image" />
            <div className="tp-category-name">ทุกหมวด</div>
          </Card>
          {getVisibleCategories().map((category: any) => (
            <Card key={category.ID} className={`tp-category-card`} onClick={() => handleCategoryClick(category.CP_NAME)} >
              <img src={category.CP_ICON} className="tp-category-card-image" />
              <div className="tp-category-name">{category.CP_NAME}</div>
            </Card>
          ))}

        </div>

        {categories.length > itemsPerPage_CP && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={handleToggleShowAll} className='show_more_category'>
              {showAllItems ? 'แสดงน้อยลง' : 'แสดงทั้งหมด'}
            </button>
          </div>
        )}
      </div>
      {/* -------------------------------------------------------------------------------------------------------- */}


      <center>
        {Object.keys(data_fiter).every((key) => key === "nameProduct" || !data_fiter[key as keyof unknown]) ? (<h1></h1>) : (
          <>
            <h3 className='text_alert_on_search_box'>
              <img src="https://img.icons8.com/?size=512&id=1Zt4ZM9tGGrG&format=png" style={{ height: '25px', marginRight: '5px' }} />
              คุณกำลังค้นหาโดยใช้ Filter
              <button onClick={clear_all_filter} className='button-clear-filter_text_alert'> 🗑️ ล้าง Filter </button>
            </h3>
          </>
        )}
      </center>

      <div className="TP_Box_for_search">
        <div style={{ width: "15%", marginRight: '2%', marginLeft: '1%' }}>
          <button className="TP_btn_sell" onClick={showDrawer}> ตัวกรอง </button>
        </div>
        <div style={{ width: "60%" }}>
          <input className="ThepatforInput" value={nameProduct} onChange={(event) => setnameProduct(event.target.value)}
            style={{ borderRadius: '15px', backgroundColor: '#ffffff', paddingLeft: '5%' }} onKeyPress={handleKeyPress}
          />
        </div>
        <div style={{ width: "15%", marginLeft: '4%' }}>
          <button className="TP_btn_s" onClick={Search}> ค้นหา </button>
        </div>
      </div>

      <div className="table_show_products">
        {/* ถ้าค้นแล้วมีสินค้าให้แสดง */}
        {products.length > 0 ? (
          <div >
            <Grid container spacing={2} >
              {products.map((product: any) => (
                // <Grid item xs={6} sm={6} md={5} lg={2} key={product.ID}>
                <Grid item xs={6} sm={6} md={3} lg={2} key={product.ID}>
                  <Card sx={{ width: '100%', borderRadius: '10px' }} className='product_cardContainer' >
                    <CardContent sx={{ padding: 0 }} onClick={() => send_data_to_Product(product)} >
                      <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                        {product.P_IMG.length > 0 ? (
                          <img src={product.P_IMG[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                        ) : (
                          <div className='TP_text_product_seller' style={{ color: '#D8D9DA' }}>
                            <p>ผู้ขายไม่ได้อัพโหลด<br />ภาพสินค้า</p>
                            <Empty />
                          </div>
                        )}
                      </div>
                      <Typography variant="h6" component="div" className='TP_font'>
                        {product.P_NAME}
                      </Typography>
                      <Typography variant="body1" component="div" className='TP_font'>
                        ราคา: {format_Price(product.P_PRICE)} บาท
                      </Typography>
                      <Typography variant="body1" component="div" fontSize={'13px'} marginTop={1}>
                        {product.P_TYPE === "สินค้ามือ 1" ? (
                          <Tag color="green" className='TP_font'> {product.P_TYPE} </Tag>
                        ) : (
                          <Tag color="gold" className='TP_font'> {product.P_TYPE} </Tag>
                        )}
                      </Typography>

                      {/* <Button style={{marginRight:'1rem'}}>ดูสินค้า</Button>
                <Button>ดูสินค้า</Button> */}

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <Pagination
                count={Math.ceil(TotalProducts / 24)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
                shape="rounded"
                variant="outlined"
              />
            </div>
          </div>

          // ถ้าไม่มีสินค้าแสดง เพื่อแจ้ลูกค้าว่าไม่พบรายการ
        ) : (
          <div className='TP_text_product_seller' style={{ color: '#D8D9DA' }}>
            <Empty description={false} />
            {/* <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2Fno%20data.svg?alt=media&token=86f4f77a-4b0c-4a72-9bd6-177665c66bbd'  style={{height:'300px'}}/> */}
            <h2 style={{ color: '#454545' }}>ไม่พบรายการที่ค้นหา</h2>

          </div>
        )}
      </div>


    </div>
  );
};

export default ProductsGrid;

//====================================  ส่วนของการเลือกหมวดหมู่ ===================================================

//ถ้ามีใช้ filter จะ return ค่าออกมา
const checkFilter = (data: any) => {
  const data_for_filter_check = { nameProduct: "", type: "", category: "", minPrice: 0, maxPrice: 0, };
  const result: any[] = [];
  Object.keys(data).forEach((key) => {
    if (data[key] !== data_for_filter_check[key as keyof typeof data_for_filter_check]) {
      result.push({ [key]: data[key] });
    }
  });
  // console.log('================================');
  // console.log('================================');
  // console.log(result);
  // console.log('================================');
  // console.log('================================');
  return result;
};


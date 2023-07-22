import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Pagination, colors } from '@mui/material';
import { width } from '@mui/system';
import { Button } from 'antd';
import { listProduct } from './HTTP_Request ';

// const generateDataProducts = () => {
//   const products = [];
//   for (let i = 1; i <= 800; i++) {
//     const product = {
//       id: i,
//       name: `Product ${i}`,
//       img: "https://www.bestsmartphoneunder10000.in/wp-content/uploads/2022/12/mi-12pro-8gb-ram-256gb-internal.jpg",
//       price: Math.floor(Math.random() * 100) + 1, // สุ่มราคาสินค้าในช่วง 1-100
//     };
//     products.push(product);
//   }
//   return products;
// };

const DataProducts = listProduct('listProduct');


// const BackendAPI = {
//   getProducts: async (page: number, pageSize: number) => {
//     const startIndex = (page - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     const data = DataProducts.slice(startIndex, endIndex);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(data);
//       }, 500);
//     });
//   },
// };

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [previousPage, setPreviousPage] = useState(0);
  const [TotalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const pageSize = 16;
      const data = await listProduct('listProduct');
      const totalProducts = data.length;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const productsData = data.slice(startIndex, endIndex);
      setProducts(productsData);
      setTotalProducts(totalProducts);
    };

    fetchProducts();
  }, [currentPage, showMore]);

  const Check_Data = () => {
    console.log(TotalProducts);
    
  };
  

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const pageSize = 16;
  //     const data = await BackendAPI.getProducts(currentPage, pageSize);
  //     setProducts(data);
  //   };

  //   fetchProducts();
  // }, [currentPage, showMore]);

  // const handleShowMore = () => {
  //   if (currentPage < Math.ceil(DataProducts.length / 16)) {
  //     setShowMore(true);
  //     setPreviousPage(currentPage);
  //     setCurrentPage((prevPage) => prevPage + 1);
  //   }
  // };


  // const handleGoBack = () => {
  //   if (previousPage > 1) {
  //     setCurrentPage(previousPage);
  //     setPreviousPage(previousPage - 1);
  //     setShowMore(true);
  //   } else if (previousPage === 1) {
  //     setCurrentPage(1);
  //     setPreviousPage(0);
  //     setShowMore(false);
  //   }
  // };


  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 515); // เมื่อกดเปลี่ยนหน้าให้เลื่อนขึ้นด้านบนของหน้าเพจ
  };

  return (
    <div style={{ alignContent: 'center' }}>

      <Button onClick={Check_Data}> ตรวจสอบข้อมูล </Button>

      <Grid container spacing={1} >
        {products.map((product) => (
          <Grid item xs={6} sm={6} md={5} lg={3} key={product.ID}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                  <img src={product.P_IMG} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <Typography variant="h6" component="div">
                  {product.P_NAME}
                </Typography>
                <Typography variant="body1" component="div">
                  ราคา: {product.P_PRICE} บาท
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination
          count={Math.ceil(TotalProducts / 16)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          shape="rounded"
          variant="outlined"
          sx={{}}
        />
      </div>
    </div>
  );
};

export default ProductsGrid;
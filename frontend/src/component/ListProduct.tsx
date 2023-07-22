// import React, { useState, useEffect } from 'react';
// import { Grid, Card, CardContent, Typography } from '@mui/material';

// const generateSampleProducts = () => {
//   const products = [];
//   for (let i = 1; i <= 100; i++) {
//     const product = {
//       id: i,
//       name: `Product ${i}`,
//       price: Math.floor(Math.random() * 100) + 1, // สุ่มราคาสินค้าในช่วง 1-100
//     };
//     products.push(product);
//   }
//   return products;
// };

// const sampleProducts = generateSampleProducts();


// const BackendAPI = {
//   getProducts: async (page: number, pageSize: number) => {
//     const startIndex = (page - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     const data = sampleProducts.slice(startIndex, endIndex);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(data);
//       }, 500);
//     });
//   },
// };

// const ProductsGrid = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showMore, setShowMore] = useState(false);
//   const [previousPage, setPreviousPage] = useState(0);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const pageSize = 16;
//       const data = await BackendAPI.getProducts(currentPage, pageSize);
//       setProducts(data);
//     };

//     fetchProducts();
//   }, [currentPage, showMore]);

//   const handleShowMore = () => {
//   if (currentPage < Math.ceil(sampleProducts.length / 16)) {
//     setShowMore(true);
//     setPreviousPage(currentPage);
//     setCurrentPage((prevPage) => prevPage + 1);
//   }
// };


//   const handleGoBack = () => {
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



// return (
//     <div>
      
//       <Grid container spacing={2}>
//         {products.map((product) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//             <Card>
//               <CardContent>
//                 <img src="https://www.applesfromny.com/wp-content/uploads/2020/05/20Ounce_NYAS-Apples2.png" width= "200" />
//                 <Typography variant="h6" component="div">
//                   {product.name}
//                 </Typography>
//                 <Typography variant="body1" component="div">
//                   Price: ${product.price}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//         <button onClick={handleGoBack}>Go Back</button>
//         <button onClick={handleShowMore}>Go Next</button>
//       </Grid>
//     </div>
//   );
// };

// export default ProductsGrid;
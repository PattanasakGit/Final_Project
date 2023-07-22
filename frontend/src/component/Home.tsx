import NavBar from "./NavBar";
import React from 'react';
import { Carousel } from 'antd';
import '../css/Background.css';
import { Box, Container, Grid, Paper } from "@mui/material";
import ProductsGrid from './ListProduct';



function Home() {
    return (
        <div >
            <center>
            {/* <div className="content_Home_Page"> */}
            <div className="pigture_Carousel">
                <Carousel autoplay >
                    <div>
                        <img src="https://www.schwab.com/sites/g/files/eyrktu1071/files/Getty_635946862_2x1.jpg" />
                    </div>
                    <div>
                        <img src="https://cdn.pic.in.th/file/picinth/Branner.jpeg" />
                    </div>
                </Carousel>
            </div>

            <div>
                <Box sx={{ border: 3, height: '100%' ,bgcolor:'#FFFFFF' ,alignContent:'center' , marginTop:'1rem'}}>
                    <button className="TP_btn_sell"> ลงขาย </button>
                    <input className="ThepatforInput" style={{margin:0, width:'50%'}}/>
                    <button className="TP_btn_s"> ค้นหา </button>

                </Box>
            </div>



            <div className="table_show_products">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2} >
                        <Box sx={{ border: 3, height: '100%' }}>

                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={10} >
                        <ProductsGrid />
                    </Grid>

                </Grid>
            </div>







        </center>
        </div>
    );
}

export default Home;




function listpuduct() { }

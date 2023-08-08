import NavBar from "./NavBar";
import React from 'react';
import { Carousel } from 'antd';
import '../css/Background.css';
import { Box, Container, Grid, Paper } from "@mui/material";
import ProductsGrid from './ListProduct';
import { padding } from "@mui/system";
import { Player } from '@lottiefiles/react-lottie-player';


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
                        <div>
                            <img src="https://www.matichon.co.th/wp-content/uploads/2018/08/Banner-770x433.jpg" />
                        </div>
                    </Carousel>
                </div>

                <div>
                    <ProductsGrid />
                </div>

                <div className="BannerSide">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <img src="https://tinyurl.com/4vvtxuzy" />
                            {/* <img src="https://mpics.mgronline.com/pics/Images/565000010102901.JPEG" /> */}
                        </Grid>
                        <Grid item xs={6}>
                            <Player
                                // src='https://lottie.host/eb9e0f2a-158b-4622-9217-a75c7326fc55/37IkrEnzIH.json'
                                src='https://lottie.host/922536cf-e302-4cae-94b2-5e541c9a0530/uZyOAEbNz9.json'
                                className="player"
                                loop
                                autoplay
                            />
                        </Grid>
                    </Grid>
                </div>







            </center>
        </div>
    );
}

export default Home;

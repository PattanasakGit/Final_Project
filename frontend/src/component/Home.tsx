import NavBar from "./system/NavBar";
import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import '../css/Background.css';
import { Box, Container, Grid, Paper } from "@mui/material";
import ProductsGrid from './ListProduct';
import { padding } from "@mui/system";
import { Player } from '@lottiefiles/react-lottie-player';
import { listData } from "./system/HTTP_Request ";

function Home() {
    const [IMG_Banner, setIMG_Banner] = useState([]);
    const [IMG_Side_Banner, setIMG_Side_Banner] = useState([]);

    const listAllData_TopBanner = async () => {
        const dataIMG_Banner = await listData('listTopBanner');
        if (dataIMG_Banner) {
            setIMG_Banner(dataIMG_Banner);
        }
    }
    const listAllData_SideBanner = async () => {
        const dataIMG_Side_Banner = await listData('listSideBanner');
        if (dataIMG_Side_Banner) {
            setIMG_Side_Banner(dataIMG_Side_Banner);
        }
    }

    useEffect(() => {
        listAllData_TopBanner();
        listAllData_SideBanner();
    }, []);

    console.log('AllSideBanner --------------------> ',IMG_Side_Banner);

    return (
        <div >
            <center>
                {/* <div className="content_Home_Page"> */}
                <div className="pigture_Carousel">
                    <Carousel autoplay >
                        {IMG_Banner.map((oneBanner: any) => (
                            <a href={oneBanner.TB_LINK}>
                                <img src={oneBanner.TB_IMG} />
                            </a>
                        ))}
                    </Carousel>
                </div>

                <div>
                    <ProductsGrid />
                </div>

                <div className="BannerSide">
                    <div className="coverSideBar">
                        <Carousel autoplay dotPosition='top'>
                            {IMG_Side_Banner.map((oneBanner: any) => (
                                <a href={oneBanner.SB_LINK}>
                                    <img src={oneBanner.SB_IMG} className="Img_SideBanner" />
                                </a>
                            ))}
                        </Carousel>
                    </div>

                    <div className="coverSideBar">

                        <Player
                            // src='https://lottie.host/eb9e0f2a-158b-4622-9217-a75c7326fc55/37IkrEnzIH.json'
                            src='https://lottie.host/922536cf-e302-4cae-94b2-5e541c9a0530/uZyOAEbNz9.json'
                            className="player"
                            loop
                            autoplay
                            style={{ height: 'auto'}}
                        />
                    </div>
                </div>
            </center>
        </div>
    );
}

export default Home;

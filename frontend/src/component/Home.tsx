import NavBar from "./NavBar";
import React from 'react';
import { Carousel } from 'antd';
import '../css/Background.css';
import { Paper } from "@mui/material";



function Home() {
    return (
        <div>
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
        </div>
    );
}

export default Home;




function listpuduct(){}

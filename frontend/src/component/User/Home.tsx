import '../../css/Background.css';
import { Carousel } from 'antd';
import ProductsGrid from './ListProduct';
import { useEffect, useState } from 'react';
import { listData } from "../WebSystem/HTTP_Request ";
import { Player } from '@lottiefiles/react-lottie-player';

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
    return (
        <div >
            <center>
                <div className="pigture_Carousel">
                    <Carousel autoplay >
                        {IMG_Banner.map((oneBanner: any) => (
                            <img src={oneBanner.TB_IMG} onClick={() => window.location.href = oneBanner.TB_LINK} />
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
                            src='https://lottie.host/922536cf-e302-4cae-94b2-5e541c9a0530/uZyOAEbNz9.json'
                            className="player"
                            loop
                            autoplay
                            style={{ height: 'auto' }}
                        />
                    </div>
                </div>
            </center>
        </div>
    );
}
export default Home;
import React  from 'react';
import { Link } from 'react-router-dom'
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import img1 from '../../assets/images/box-item/img_item1.png'
import img2 from '../../assets/images/box-item/img_item2.png'
import img3 from '../../assets/images/box-item/img_item3.png'
import shape1 from '../../assets/images/backgroup-secsion/bg-gradient1.png'
import shape2 from '../../assets/images/backgroup-secsion/bg-gradient2.png'
import shape3 from '../../assets/images/backgroup-secsion/bg-gradient3.png'

const SliderStyle4 = () => {
    
    return (
        <div>
            <section className="flat-title-page style3 mainslider">
                <img className="bgr-gradient gradient1" src={shape1} alt="Axies" />
                <img className="bgr-gradient gradient2" src={shape2} alt="Axies" />
                <img className="bgr-gradient gradient3" src={shape3} alt="Axies" />
                <div className="overlay"></div>
                <div className="themesflat-container ">
                        <div className="wrap-heading flat-slider flex">
                            <div className="content">
                                <h2 className="heading mt-15">Discover, learn, collect
                                </h2>	
                                <h1 className="heading mb-style"><span className="tf-text s1">#HistoricalNFTs</span>
                                </h1>
                                <p className="sub-heading mt-19 mb-40">These NFTs are connections to earlier periods of crypto history, often uniquely crafted, created before standards existed, and now sought by collectors seeking rare and authentic pieces on the Blockchain.
                                </p>
                                <div className="flat-bt-slider flex style2">
                                    <Link to="/explore" className="sc-button header-slider style style-1 rocket fl-button pri-1"><span>Explore
                                    </span></Link>
                                    <Link to="/create-item" className="sc-button header-slider style style-1 note fl-button pri-1"><span>Add Archaeological Find
                                    </span></Link>
                                </div>
                            </div>
                            <Swiper
                                modules={[ Autoplay ]}
                                direction={"vertical"}
                                spaceBetween={25}
                                slidesPerView={5}
                                loop
                                autoplay={{
                                    delay: 1,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed= {2000}
                            >
                                <SwiperSlide><img src="https://pixelmap.io/assets/images/logo.png" alt="PixelMap" width="230px" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1443910587218468869/4EnJz_Ps_400x400.jpg" width="230px" alt="Curio Cards" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1487535556212899841/deEDoQsq_400x400.png" width="230px" alt="MoonCatRescue" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1468967145325223939/GGJZgiy0_400x400.jpg" width="230px" alt="Etheria" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1464784539369181188/B1Mg3aDD_400x400.jpg" width="230px" alt="CryptoCats" /></SwiperSlide>

                            </Swiper>
                            <Swiper
                                modules={[ Autoplay ]}
                                direction={"vertical"}
                                spaceBetween={25}
                                slidesPerView={5}
                                loop
                                autoplay={{
                                    delay: 1,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed= {1800}
                            >
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1477978145047339015/lRSBbcFW_400x400.jpg" width="230px" alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/media/FLljE9VXEAcFn5O?format=png&name=small" width="230px" alt="CryptoPunks" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1038100267764473856/-5YZzEIE_400x400.jpg" width="230px" alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1482650504337448960/e5N8_-0W_400x400.jpg" width="230px" alt="CryptoSkulls" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1367892217533173768/TZD_RtU__400x400.jpg" alt="PixelCons" width="230px" /></SwiperSlide>

                            </Swiper>
                            <Swiper
                                modules={[ Autoplay ]}
                                direction={"vertical"}
                                spaceBetween={25}
                                slidesPerView={5}
                                loop
                                autoplay={{
                                    delay: 1,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed= {2200}
                            >
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1423335465881640967/Quu29IIF_400x400.png" width="230px" alt="CryptoArte" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1424089401106305026/ObSFZaMS_400x400.jpg" width="230px" alt="EtherRocks" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1432194219452502016/mpI5FvbO_400x400.jpg" width="230px" alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/1434169095428050944/wtllquM4_400x400.jpg" width="230px" alt="Pixereum" /></SwiperSlide>
                                <SwiperSlide><img src="https://pbs.twimg.com/profile_images/954122555400638464/wP0a89Kq_400x400.jpg" width="230px" alt="EtherLambos" /></SwiperSlide>

                            </Swiper>
                        </div>
                        
                    </div>
            </section>
        </div>
    );
}


export default SliderStyle4;

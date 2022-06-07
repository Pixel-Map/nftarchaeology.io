import React  from 'react';
import { Link } from 'react-router-dom'
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import shape1 from '../../assets/images/backgroup-secsion/bg-gradient1.png'
import shape2 from '../../assets/images/backgroup-secsion/bg-gradient2.png'
import shape3 from '../../assets/images/backgroup-secsion/bg-gradient3.png'
import {useFetch} from "../../lib/useFetch";

// Use this to randomize which NFTs are displayed on the front page
function randomizeAndSplit(data, chunkSize) {
    var arrayOfArrays = [];
    var shuffled = [...data]; //make a copy so that we don't mutate the original array

    //shuffle the elements
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    //split the shuffled version by the chunk size
    for (var i=0; i<shuffled.length; i+=chunkSize) {
        arrayOfArrays.push(shuffled.slice(i,i+chunkSize));
    }
    return arrayOfArrays;
}


const SliderStyle4 = () => {
    let randomized;
    const nftData = useFetch(`https://api.nftarchaeology.io/nfts`)
    if (!nftData) {
        return <div>Loading...</div>;
    } else {
        randomized = randomizeAndSplit(nftData, 6)
    }
    if (!randomized) {
        return <div>Loading...</div>
    }
    console.log(randomized)
    return (
        <div>
            <section className="flat-title-page style3 mainslider">
                <img className="bgr-gradient gradient1" src={shape1} alt="Axies" />
                <img className="bgr-gradient gradient2" src={shape2} alt="Axies" />
                <img className="bgr-gradient gradient3" src={shape3} alt="Axies" />
                <div className="overlay" />
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
                                    <a href="https://github.com/Pixel-Map/historicalNFTs" className="sc-button header-slider style style-1 note fl-button pri-1"><span>Add Archaeological Find
                                    </span></a>
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
                                {
                                    randomized[0].map((item,index) => (
                                        <SwiperSlide key={index} item={item} ><a href={`/nft-details/${item.title.replace(/\s+/g, '').toLowerCase()}`}><img alt={item.key} src={`https://api.nftarchaeology.io/${item.logo}`} width="230px" /></a></SwiperSlide>
                                    ))
                                }
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
                                {
                                    randomized[1].map((item,index) => (
                                        <SwiperSlide key={index} item={item} ><a href={`/nft-details/${item.title.replace(/\s+/g, '').toLowerCase()}`}><img alt={item.key} src={`https://api.nftarchaeology.io/${item.logo}`} width="230px" /></a></SwiperSlide>
                                    ))
                                }
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
                                {
                                    randomized[2].map((item,index) => (
                                        <SwiperSlide key={index} item={item} ><a href={`/nft-details/${item.title.replace(/\s+/g, '').toLowerCase()}`}><img alt={item.key} src={`https://api.nftarchaeology.io/${item.logo}`} width="230px" /></a></SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>

                    </div>
            </section>
        </div>
    );
}


export default SliderStyle4;

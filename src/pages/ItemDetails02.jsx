import React, {useState} from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {Link, useParams} from 'react-router-dom'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import img1 from '../assets/images/avatar/avt-3.jpg'
import img2 from '../assets/images/avatar/avt-11.jpg'
import img3 from '../assets/images/avatar/avt-1.jpg'
import img4 from '../assets/images/avatar/avt-5.jpg'
import img5 from '../assets/images/avatar/avt-7.jpg'
import img6 from '../assets/images/avatar/avt-8.jpg'
import etherscan from "../assets/images/logo/etherscan.jpg";
import ethereum from '../assets/images/logo/ethereum.png'
import {useFetch} from "../lib/useFetch";
import {Timeline} from "react-twitter-widgets";
import {Accordion} from "react-bootstrap-accordion";
import {FlagsComponent} from "../components/flagsComponent";

const ItemDetails02 = () => {
    const {id} = useParams();
    const nftData = useFetch(`https://pixelmap.art/nfts/${id}.json`);
    const priceData = useFetch(`https://pixelmap.art/nfts/prices.json`);
    console.log(nftData)
    const [dataHistory] = useState(
        [
            {
                img: img1,
                name: "Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img2,
                name: "Mason Woodward",
                time: "at 06/10/2021, 3:20 AM",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img3,
                name: "Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img4,
                name: "Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img5,
                name: "Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
            {
                img: img6,
                name: "Mason Woodward",
                time: "8 hours ago",
                price: "4.89 ETH",
                priceChange: "$12.246"
            },
        ]
    )
    if (!nftData) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className='item-details'>
                <Header/>
                <section className="flat-title-page inner">
                    <div className="overlay"></div>
                    <div className="themesflat-container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="page-title-heading mg-bt-12">
                                    <h1 className="heading text-center">{nftData.title}</h1>
                                </div>
                                <div className="breadcrumbs style2">
                                    <ul>
                                        <li><Link to="/">Home</Link></li>
                                        <li><Link to="#">Explore</Link></li>
                                        <li>{nftData.title}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="tf-section tf-item-details style-2">
                    <div className="themesflat-container">
                        <div className="row">
                            <div className="col-xl-6 col-md-12">
                                <div className="content-left">
                                    <div className="media">
                                        {nftData.profileImage ?
                                        <img src={nftData.profileImage} alt="Axies"/> : <img src={nftData.logo} alt="Axies"/>
                                        }
                                    </div>
                                </div>
                                {nftData.faq && (
                                <div className="pad-t-17 pad-b-54"><h2>FAQ</h2>
                                    {
                                        nftData.faq && nftData.faq.map((item,index) => (
                                          <Accordion key={index} title={item.question} >
                                              <p>{item.answer}</p>
                                          </Accordion>
                                        ))
                                    }
                                </div>
                                )}
                            </div>
                            <div className="col-xl-6 col-md-12">
                                <div className="content-right">
                                    <div className="sc-item-details">
                                        <div className="meta-item">
                                            <div className="left">
                                                <h2>{nftData.title} Information</h2>
                                            </div>
                                            <div className="right">
                                                <span className="viewed eye mg-r-8">225</span>
                                                <span to="/login" className="liked heart wishlist-button"><span
                                                    className="number-like">100</span></span>
                                            </div>
                                        </div>
                                        <div className="client-infor sc-card-product">
                                            <div className="meta-info">
                                                <div className="author">
                                                    <div className="avatar">
                                                        <img src={ethereum} alt="Ethereum"/>
                                                    </div>
                                                    <div className="info">
                                                        <span>Chain</span>
                                                        <h6><Link to="/author-02">Ethereum</Link></h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="meta-info">
                                                <div className="author">
                                                    {/*<div className="avatar">*/}
                                                    {/*    <img src={img2016} alt="Axies"/>*/}
                                                    {/*</div>*/}
                                                    <div className="info">
                                                        <span>Date Deployed</span>
                                                        <h6><Link to="/author-02">{new Date(nftData.creationTimestamp.replace(" +UTC", "")).toLocaleString()}</Link></h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p>{nftData.excerpt}</p>
                                        <div className="meta-item-details">
                                            <div className="item-style-2 item-details">
                                                <ul className="list-details">
                                                    <li><span>Supply: </span><h6>{nftData.totalSupply}</h6></li>
                                                    <li><span>Standard: </span><h6>{nftData.standard}</h6></li>
                                                    <li><span>Active Development:</span><h6>{nftData.activeDevelopment ? "Yes" : "No"}</h6></li>
                                                    <li><span>Verified on OpenSea: </span><h6>{nftData.openseaVerification ? "Yes" : "No"}</h6></li>
                                                    <li><span>Static Supply: </span><h6>{nftData.staticSupply ? "Yes" : "No"}</h6></li>
                                                    <li><span>Nonfungible: </span><h6>{nftData.nonfungible ? "Yes" : "No"}</h6></li>
                                                    <li><span>Asset Data Location: </span><h6>{nftData.assetDataLocation}</h6></li>
                                                </ul>
                                            </div>
                                            <div className="item-style-2">
                                                <div className="item meta-price">
                                                    <span className="heading">Current Floor</span>
                                                    <div className="price">
                                                        <div className="price-box">
                                                            {priceData && priceData.filter(nft => nft.name == nftData.title).map(filteredNFT => (
                                                                <>
                                                            <h5> {filteredNFT.stats.floor_price} ETH</h5>
                                                            <span> (${Number(filteredNFT.stats.floor_price * 3136.89).toLocaleString()})</span>
                                                                </>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <FlagsComponent flags={nftData.flags} />

                                            </div>
                                        </div>

                                        <div className="flat-tabs themesflat-tabs">
                                            <Tabs>
                                                <TabList>
                                                    <Tab>Contracts</Tab>
                                                    <Tab>Most Recent Sales</Tab>
                                                    <Tab>Tweets</Tab>
                                                    <Tab>Related Links</Tab>
                                                </TabList>

                                                <TabPanel>
                                                    <ul className="bid-history-list">
                                                        {
                                                            nftData.contracts.map((item, index) => (
                                                                <li key={index} item={item}>
                                                                    <div className="content">
                                                                        <div className="client">
                                                                            <div className="sc-author-box style-2">
                                                                                <div className="author-avatar">
                                                                                    <a href={`https://etherscan.io/address/${item.address}`}>
                                                                                        <img src={etherscan} alt="Etherscan"
                                                                                             className="avatar"/>
                                                                                    </a>
                                                                                </div>
                                                                                <div className="author-infor">
                                                                                    <div className="name">
                                                                                        <h6><a
                                                                                            href={`https://etherscan.io/address/${item.address}`}>{item.name} </a>
                                                                                        </h6> <span> {item.address}</span>
                                                                                    </div>
                                                                                    <span
                                                                                        className="time">{item.notes}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </TabPanel>
                                                <TabPanel>
                                                    <ul className="bid-history-list">
                                                        <li>
                                                            <div className="content">
                                                                {nftData?.wrapperContract && nftData.wrapperContract.address ?
                                                                <div className="client dunexyz">
                                                                    <iframe
                                                                        src={`https://dune.xyz/embeds/115897/235053/6c9e742f-0494-4a70-9ea0-7148fc7311a8?contract_address=${nftData.wrapperContract.address.replace("0x", "x")}`}
                                                                        height="500" width="600"
                                                                        title="chart 1"></iframe>
                                                                </div> : <p>Non ERC-721 NFT, or no wrapper listed.</p>
                                                                }
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </TabPanel>
                                                <TabPanel>
                                                    <Timeline
                                                        dataSource={{
                                                            sourceType: 'profile',
                                                            screenName: nftData.twitter.replace("@","")
                                                        }}
                                                        options={{
                                                            height: '700',
                                                            width: '700',

                                                        }}
                                                    />
                                                </TabPanel>
                                                <TabPanel>
                                                    <ul className="bid-history-list">
                                                        {
                                                            nftData.relatedLinks && nftData.relatedLinks.map((item, index) => (
                                                              <li key={index} item={item}>
                                                                  <div className="content">
                                                                      <div className="client">

                                                                              <div className="author-infor">
                                                                                  <div className="name">
                                                                                      <a
                                                                                        href={item.link}>{item.name} </a>
                                                                                      <span> {item.address}</span>
                                                                                  </div>

                                                                              </div>
                                                                      </div>
                                                                  </div>
                                                              </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </TabPanel>
                                            </Tabs>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>




                <Footer/>
            </div>
        );
    }
}

export default ItemDetails02;

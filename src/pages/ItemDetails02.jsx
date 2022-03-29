import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {Link, useParams} from 'react-router-dom'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import etherscan from "../assets/images/logo/etherscan.jpg";
import ethereum from '../assets/images/logo/ethereum.png'
import {useFetch} from "../lib/useFetch";
import {Timeline} from "react-twitter-widgets";
import {Accordion} from "react-bootstrap-accordion";
import {FlagsComponent} from "../components/flagsComponent";
import {TwitterFollowButton} from "react-twitter-embed";
import ReactMarkdown from 'react-markdown'

const ItemDetails02 = () => {
    const {id} = useParams();
    const nftData = useFetch(`https://pixelmap.art/nfts/${id}.json`);
    const priceData = useFetch(`https://pixelmap.art/nfts/prices.json`);

    if (!nftData) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className='item-details'>
                <Header/>
                <section className="flat-title-page inner">
                    <div className="overlay" />
                    <div className="themesflat-container">
                        <div className="row">
                            <div className="col-md-12">

                                <div className="page-title-heading mg-bt-12">
                                    <div className="meta-title-item">
                                        <div className="left">
                                            <h1 className="heading text-center kheader">
                                                <span>{nftData.logo && <img src={nftData.logo} alt="logo" width="48px" />}</span>
                                                {nftData.title}</h1><br/>
                                        </div>
                                    </div>

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
                                <div className="content-right">
                                    <div className="sc-item-details">
                                        <div className="meta-title-item">
                                            <div className="left">
                                                <h2>Overview</h2><br/>
                                            </div>
                                        </div>
                                        <h5 className="sub-title ">{nftData.excerpt}</h5><br/>
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
                                        <TwitterFollowButton
                                            screenName={nftData.twitter.replace("@","")}
                                        />

                                        <div id="discord-button">
                                            <a href={nftData.discord} >
                                                <div className="icon">
                                                    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 240">
                                                        <path className="st0" d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z" />
                                                        <path className="st0" d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z" />
                                                    </svg>
                                                </div>
                                                <span><b>Join the Discord</b></span>
                                            </a>
                                        </div>
                                        <br/>



                                        <div className="meta-item-details">
                                            <div className="item-style-2 item-details">
                                                <ul className="list-details">

                                                    <li><span>Website: </span><h6><a href={nftData.website}>{nftData.website.replace("https://", "").replace("http://", "")}</a></h6></li>
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
                                                            {priceData && priceData.filter(nft => nft.name === nftData.title).map(filteredNFT => (
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
                                                                        title="chart 1" />
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
                            <div className="col-xl-6 col-md-12">
                                {nftData.analysis &&
                                <div className="content-left">
                                    <div className="pad-t-17 clearme">
                                        <ReactMarkdown>{nftData.analysis}</ReactMarkdown>

                                    </div>
                                </div>
                                }
                                {nftData.faq && (
                                    <div className="pad-t-17 pad-b-54"><h2>FAQ</h2>
                                        {
                                            nftData.faq && nftData.faq.map((item,index) => (
                                                <Accordion key={index} title={item.question} show={true} >
                                                    <p>{item.answer}</p>
                                                </Accordion>
                                            ))
                                        }

                                    </div>
                                )}
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

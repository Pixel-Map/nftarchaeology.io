import React, { useState ,useEffect } from 'react';
import { Link } from 'react-router-dom'
import logodark from '../../assets/images/logo/logo_dark.png'
const Footer = () => {
    const socialList = [
        {
            icon: "fab fa-twitter",
            link: "https://twitter.com/PixelMapNFT"
        },
        // {
        //     icon: "fab fa-facebook",
        //     link: "#"
        // },
        // {
        //     icon: "fab fa-telegram-plane",
        //     link: "#"
        // },
        // {
        //     icon: "fab fa-youtube",
        //     link: "#"
        // },
        // {
        //     icon: "icon-fl-tik-tok-2",
        //     link: "#"
        // },
        {
            icon: "icon-fl-vt",
            link: "https://discord.gg/pixelmap"
        },


    ]

    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener("scroll", toggleVisibility);
  
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

      
    return (
        <div>
            <footer id="footer" className="footer-light-style clearfix bg-style">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-12">
                            <div className="widget widget-logo">
                                <div className="logo-footer" id="logo-footer">
                                    <Link to="/">
                                        <img className='logo-dark' id="logo_footer" src={logodark} alt="nft-gaming" />
                                        <img className='logo-light' id="logo_footer" src={logodark} alt="nft-gaming" />
                                        
                                    </Link>
                                </div>
                                <p className="sub-widget-logo">Site maintained by the team behind PixelMap.io, with the help of various NFT archaeologists for curation.</p>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu style-1">
                                {/*<h5 className="title-widget">My Account</h5>*/}
                                {/*<ul>*/}
                                {/*    {*/}
                                {/*        accountList.map((item,index) =>(*/}
                                {/*            <li key={index}><Link to={item.link}>{item.title}</Link></li>*/}
                                {/*        ))*/}
                                {/*    }*/}
                                {/*</ul>*/}
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-7 col-7">
                            <div className="widget widget-menu style-2">
                                {/*<h5 className="title-widget">Resources</h5>*/}
                                {/*<ul>*/}
                                {/*    {*/}
                                {/*        resourcesList.map((item,index) =>(*/}
                                {/*            <li key={index}><Link to={item.link}>{item.title}</Link></li>*/}
                                {/*        ))*/}
                                {/*    }*/}
                                {/*</ul>*/}
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu fl-st-3">
                                {/*<h5 className="title-widget">Company</h5>*/}
                                {/*<ul>*/}
                                {/*    {*/}
                                {/*        companyList.map((item,index) =>(*/}
                                {/*            <li key={index}><Link to={item.link}>{item.title}</Link></li>*/}
                                {/*        ))*/}
                                {/*    }*/}
                                {/*</ul>*/}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-7 col-12">
                            <div className="widget widget-subcribe">
                                <h5 className="title-widget">Follow Us</h5>

                                <div className="widget-social style-1 mg-t32">
                                    <ul>
                                        {
                                            socialList.map((item,index) =>(
                                                <li key={index}><a href={item.link}><i className={item.icon} /></a></li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {
                isVisible && 
                <Link onClick={scrollToTop}  to='#' id="scroll-top" />
            }
            
            <div className="modal fade popup" id="popup_bid" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body space-y-20 pd-40">
                            <h3>Place a Bid</h3>
                            <p className="text-center">You must bid at least <span className="price color-popup">4.89 ETH</span>
                            </p>
                            <input type="text" className="form-control"
                                placeholder="00.00 ETH" />
                            <p>Enter quantity. <span className="color-popup">5 available</span>
                            </p>
                            <input type="number" className="form-control" placeholder="1" />
                            <div className="hr" />
                            <div className="d-flex justify-content-between">
                                <p> You must bid at least:</p>
                                <p className="text-right price color-popup"> 4.89 ETH </p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p> Service free:</p>
                                <p className="text-right price color-popup"> 0,89 ETH </p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p> Total bid amount:</p>
                                <p className="text-right price color-popup"> 4 ETH </p>
                            </div>
                            <Link to="#" className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> Place a bid</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default Footer;

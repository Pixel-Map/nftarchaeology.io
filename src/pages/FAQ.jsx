import React , { useState } from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Accordion } from 'react-bootstrap-accordion'

const FAQ = () => {
    const [data] = useState(
        [
            {   key: "0",
                show: "show",
                title: 'What is an NFT?',
                text: 'NFTs or non-fungible tokens, are cryptographic assets on blockchain with unique identification codes and metadata that distinguish them from each other. NFTs are unique and not mutually interchangeable, which means no two NFTs are the same.'
            },
            {
                key: "1",
                title: 'I have a question, who should I reach out to?',
                text: 'For now, you can reach out to me directly on Twitter, @kenerwin88, or via Discord: kendog2012#3125.  Thank you!'
            },
            {
                key: "2",
                title: "What is a semi-fungible token?",
                text: "A nonfungible token specifically refers to unique assets (1/1, commonly found as ERC-721 contracts).  " +
                  "A semifungible token (often ERC-1155) allows for minting multiple copies of the same creation.  " +
                  "Each copy is not numbered, an example of this in the historical landscape are Curio Cards."
            },
            {
                key: "3",
                title: "What does the term 'wrapped' mean?",
                text: "When you come across a 'wrapped' NFT on an Ethereum protocol, it essentially means an underlying " +
                  "asset (which is incompatible due to its contract standard and/or native blockchain) has been " +
                  "tokenized into the ERC-721 standard for compatibility with popular platforms such as OpenSea."
            },
            {
                key: "4",
                title: "What  is Emblem Vault on OpenSea?",
                text: "EmblemVault is made up of thousands of NFTs which were originally minted on other blockchains. " +
                  "The NFTs have been ‘wrapped’ and showcased within Emblem Vault. The reason for doing this is to make " +
                  "them more readily accessible and tradable on a popular marketplace.  "
            },
            {
                key: "5",
                title: "Where can I buy historical NFTs?",
                text: "Historical NFTs are available to purchase on a variety of different platforms. Due to the evolution of NFTs having taken place across several different standards, you cannot currently access all historical NFT assets in a single marketplace.  \n" +
                   +
                  "The most popular and accessible platform in use at the moment is OpenSea.io.  You will find a lot of historical items here under their collection name, but watch out for fake collections!\n" +
                  "Lastly, some historical NFTs cannot be wrapped, and predate ERC-721.  In thoses cases, they may host their own exchange (i.e. Etheria)."
            },
            {
                key: "6",
                title: "Why do people attribute value to historical NFTs?",
                text: "The answer to this question is wide and varied, but in short, we can say this:  Many historical collections represent innovative technological firsts in the evolution of NFTs. The first generative art project, the first avatar NFT, the first interoperable NFT and so on and so forth.  This represents extremely high value to collectors. \n" +
                  "\n" +
                  "These projects were the building blocks that paved the way to the current NFT landscape.  The number of NFTs minted prior to 2019 is finite and representative of early-stage experimentation.  There will never be any more and their significance cannot be altered with time.  It will only increase.  \n" +
                  "\n" +
                  "For these reasons and many more, it’s considered these historically significant NFTs will be coveted as highly collectible digital assets.\n"
            },
        ]
    )
    return (
        <div>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">FAQ</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Pages</Link></li>
                                    <li>FAQ</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <section className="tf-section wrap-accordion">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="tf-title-heading ct style-2 fs-30 mg-bt-10">
                                Frequently Asked Questions
                            </h2>
                            <h5 className="sub-title help-center mg-bt-32 ">
                                Warning, the site is under HEAVY construction, so please give us some time :).
                            </h5>
                        </div>
                        <div className="col-md-12">
                            <div className="flat-accordion2">
                                {
                                    data.map((item,index) => (
                                        <Accordion key={index} title={item.title} >
                                            <p>{item.text}</p>
                                        </Accordion>
                                    ))
                                }                             
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default FAQ;

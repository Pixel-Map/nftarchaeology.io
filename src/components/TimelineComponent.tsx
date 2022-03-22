/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Badge,
  Card,
  CardBody,
} from "reactstrap";
import { NFT } from "../interfaces/nft.interface";
import {useFetch} from "../lib/useFetch";
import {sortNFTs} from "../lib/sortNFTs";

const TimelineComponent = () => {
  const nftData = useFetch("https://pixelmap.art/nfts/all.json");
  if (!nftData) {
    return <div>Loading...</div>;
  } else {

    const realNFTs = []
    for (const nft of nftData as NFT[]) {
      if (nft.title != "TerraNullius") {
        realNFTs.push(nft)
      }
    }
    const sortedNFTs = sortNFTs(realNFTs)

    // @ts-ignore
    return (
      <>
        <div>
          <Card className="card-timeline card-plain darkness bgr-gradient">
            <CardBody>
              <ul className="timeline">
                {(sortedNFTs as NFT[]).map((item, key) => (

                  <li key={key} className={`${key % 2 == 1 ? "timeline-inverted" : ""}`}>
                    <div className="timeline-badge ">
                      <img src={item.logo}
                           alt="Axies"/>
                      <i className="tim-icons icon-gift-2"/>
                    </div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <Badge color="primary" pill>
                          <h4>{item.creationTimestamp}</h4>
                        </Badge>
                      </div>
                      <div className="timeline-body">
                        <p>{item.excerpt}
                        </p>
                      </div>
                      <Link
                        to={`/nft-details/${item.title.toLowerCase()}`}
                      >
                      <h6>
                        <i className="ti-time"/>
                        More information
                      </h6>
                      </Link>
                    </div>
                  </li>
                ))}



              </ul>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
};

export default TimelineComponent;

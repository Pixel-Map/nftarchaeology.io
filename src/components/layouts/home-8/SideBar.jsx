import React, { useState } from "react";
import { Accordion } from "react-bootstrap-accordion";

const SideBar = () => {
  const [dataCate] = useState([
    {
      title: "Year",
      content: [
        {
          field: "2015",
          checked: "checked",
        },
        {
          field: "2016",
          checked: "checked",
        },
        {
          field: "2017",
          checked: "checked",
        },
        {
          field: "2018",
          checked: "checked",
        },
        {
          field: "2019",
          checked: "checked",
        },
      ],
    },
    {
      title: "Asset Storage Type",
      content: [
        {
          field: "Onchain",
          checked: "checked",
        },
        {
          field: "IPFS",
          checked: "checked",
        },
        {
          field: "Webserver",
          checked: "",
        },
      ],
    },
    {
      title: "Contract Standard",
      content: [
        {
          field: "Predates ERC-721",
          checked: "checked",
        },
        {
          field: "ERC-20",
          checked: "checked",
        },
        {
          field: "ERC-721",
          checked: "checked",
        },
      ],
    },
  ]);
  return (
    <div id="side-bar" className="side-bar style-3 item">
      <div className="widget widget-filter style-1 mgbt-0">
        <div className="header-widget-filter">
          <h4 className="title-widget">Filter</h4>
        </div>
      </div>
      <div className="divider"></div>
      <div className="wrap-category">
        {dataCate.map((item, index) => (
          <div key={index} className="widget widget-category boder-bt">
            <Accordion title={item.title} show={true}>
              <form action="#">
                {item.content.map((itemm, index) => (
                  <div key={index}>
                    <label>
                      <span>{itemm.field}</span>
                      <span className="pst-re">
                        <input type="checkbox" defaultChecked={itemm.checked} />
                        <span className="btn-checkbox"></span>
                      </span>
                    </label>
                    <br />
                  </div>
                ))}
              </form>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;

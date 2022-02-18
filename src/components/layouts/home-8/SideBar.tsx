import React from 'react';
import { Accordion } from 'react-bootstrap-accordion';

interface Props {
  contractStandardFilter: {
      field: string,
      checked: boolean
    }[],
  contractStandardHandler: (position: number) => void;

  yearFilter: {
    field: string,
    checked: boolean
  }[],
  yearHandler: (position: number) => void;

  assetStorageTypeFilter: {
    field: string,
    checked: boolean
  }[],
  assetStorageTypeFilterHandler: (position: number) => void;


}

const SideBar = (props: Props) => {

  // @ts-ignore
  return (
    <div id="side-bar" className="side-bar style-3 item">
      <div className="widget widget-filter style-1 mgbt-0">
        <div className="header-widget-filter">
          <h4 className="title-widget">Filter</h4>
        </div>
      </div>
      <div className="divider" />
      <div className="wrap-category">

        <div className="widget widget-category boder-bt">
          <Accordion title="Year" show={true}>
            <form action="#">
              {props.yearFilter.map((itemm, index) => (
                <div key={index}>
                  <label>
                    <span>{itemm.field}</span>
                    <span className="pst-re">
                      <input type="checkbox" onChange={() => props.yearHandler(index)}   defaultChecked={true} />
                      <span className="btn-checkbox" />
                    </span>
                  </label>
                  <br />
                </div>
              ))}
            </form>
          </Accordion>
        </div>
        <div className="widget widget-category boder-bt">
          <Accordion title="Asset Storage Type" show={true}>
            <form action="#">
              {props.assetStorageTypeFilter.map((itemm, index) => (
                <div key={index}>
                  <label>
                    <span>{itemm.field}</span>
                    <span className="pst-re">
                      <input type="checkbox" onChange={() => props.assetStorageTypeFilterHandler(index)}  defaultChecked={true} />
                      <span className="btn-checkbox" />
                    </span>
                  </label>
                  <br />
                </div>
              ))}
            </form>
          </Accordion>
        </div>
        <div className="widget widget-category boder-bt">
          <Accordion title="Contract Standard" show={true}>
            <form action="#">
              {props.contractStandardFilter.map((itemm, index) => (
                <div key={index}>
                  <label>
                    <span>{itemm.field}</span>
                    <span className="pst-re">
                      <input type="checkbox" onChange={() => props.contractStandardHandler(index)} defaultChecked={itemm.checked} />
                      <span className="btn-checkbox" />
                    </span>
                  </label>
                  <br />
                </div>
              ))}
            </form>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

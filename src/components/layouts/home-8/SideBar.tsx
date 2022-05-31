import React from 'react';
import { Accordion } from 'react-bootstrap-accordion';

interface Props {
  standard: {
      field: string,
      checked: boolean
    }[],
  standardHandler: (position: number) => void;

  year: {
    field: string,
    checked: boolean
  }[],
  yearHandler: (position: number) => void;

  assetDataLocation: {
    field: string,
    checked: boolean
  }[],
  assetDataLocationHandler: (position: number) => void;

  categories: {
    field: string,
    checked: boolean
  }[],
  categoriesHandler: (position: number) => void;


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
              {props.year.map((itemm, index) => (
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
              {props.assetDataLocation.map((itemm, index) => (
                <div key={index}>
                  <label>
                    <span>{itemm.field}</span>
                    <span className="pst-re">
                      <input type="checkbox" onChange={() => props.assetDataLocationHandler(index)}  defaultChecked={true} />
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
              {props.standard.map((itemm, index) => (
                <div key={index}>
                  <label>
                    <span>{itemm.field}</span>
                    <span className="pst-re">
                      <input type="checkbox" onChange={() => props.standardHandler(index)} defaultChecked={itemm.checked} />
                      <span className="btn-checkbox" />
                    </span>
                  </label>
                  <br />
                </div>
              ))}
            </form>
          </Accordion>
        </div>
        <div className="widget widget-category boder-bt pb-40">
          <Accordion title="Category" show={true}>
            <form action="#">
              {props.categories.map((itemm, index) => (
                <div key={index}>
                  <label>
                    <span>{itemm.field}</span>
                    <span className="pst-re">
                      <input type="checkbox" onChange={() => props.categoriesHandler(index)} defaultChecked={itemm.checked} />
                      <span className="btn-checkbox" />
                    </span>
                  </label>
                  <br />
                </div>
              ))}
            </form>
          </Accordion>
        </div>
        <div className="pb-40 pt-40"></div>
      </div>
    </div>
  );
};

export default SideBar;

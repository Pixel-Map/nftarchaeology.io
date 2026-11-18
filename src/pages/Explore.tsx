import React, {useState} from 'react';
import {filterOptions, nfts} from '../lib/catalogue';
import Header from '../components/header/HeaderStyle2';
import ItemContent from '../components/layouts/home-8/ItemContent';
import SideBar from '../components/layouts/home-8/SideBar';


const Explore = () => {
    const options = (values: string[]) => values.map(field => ({field, checked: true}));
    const [year, setYear] = useState(() => options(Array.from(new Set(nfts.map(nft => String(nft.year)))).sort()));
    const [assetDataLocation, setAssetDataLocation] = useState(() => options(filterOptions.AssetDataLocation));
    const [standard, setStandard] = useState(() => options(filterOptions.Standard));
    const [categories, setCategories] = useState(() => options(filterOptions.Category));


    const yearHandler = (position: number) => {
        const updatedYear = year.map((item, index) =>
          index === position ? {field: item.field, checked: !item.checked} : item
        );
        setYear(updatedYear);
    };
    const assetDataLocationHandler = (position: number) => {
        const updatedAssetDataLocationHandler = assetDataLocation.map((item, index) =>
          index === position ? {field: item.field, checked: !item.checked} : item
        );
        setAssetDataLocation(updatedAssetDataLocationHandler);
    };
    const standardHandler = (position: number) => {
        const updatedStandard = standard.map((item, index) =>
          index === position ? {field: item.field, checked: !item.checked} : item
        );
        setStandard(updatedStandard);
    };

    const categoriesHandler = (position: number) => {
        const updatedCategories = categories.map((item, index) =>
          index === position ? {field: item.field, checked: !item.checked} : item
        );
        setCategories(updatedCategories);
    };


    return (
        <div className='home-8'>
            <Header />
            <section className="tf-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-box-17">
                            <SideBar year={year} yearHandler={yearHandler} assetDataLocationHandler={assetDataLocationHandler} assetDataLocation={assetDataLocation} standard={standard} standardHandler={standardHandler} categories={categories} categoriesHandler={categoriesHandler} />
                        </div>
                        <div className="col-box-83">
                            <ItemContent year={year} assetDataLocation={assetDataLocation} standard={standard} categories={categories}  />
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Explore;

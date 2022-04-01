import React, {useState} from 'react';
import Header from '../components/header/HeaderStyle2';
import ItemContent from '../components/layouts/home-8/ItemContent';
import SideBar from '../components/layouts/home-8/SideBar';


const Explore = () => {
    const [yearFilter, setYearFilter] = useState([
        {
            field: '1994',
            checked: true
        },
        {
            field: '2015',
            checked: true
        },
        {
            field: '2016',
            checked: true
        },
        {
            field: '2017',
            checked: true
        },
        {
            field: '2018',
            checked: true
        },
        {
            field: '2019',
            checked: true
        }
    ])
    const [assetStorageTypeFilter, setAssetStorageTypeFilter] = useState([
        {
            field: 'Onchain',
            checked: true
        },
        {
            field: 'IPFS',
            checked: true
        },
        {
            field: 'Webserver',
            checked: true
        }
    ])
    const [contractStandardFilter, setContractStandardFilter] = useState([
        {
            field: 'Predates ERC-721',
            checked: true
        },
        {
            field: 'ERC-20',
            checked: true
        },
        {
            field: 'ERC-721',
            checked: true
        },
        {
            field: 'Predates ERC-1155',
            checked: true
        },
        {
            field: "ERC-1155",
            checked: true
        }
    ])

    const yearHandler = (position: number) => {
        const updatedYearFilter = yearFilter.map((item, index) =>
          index === position ? {field: item.field, checked: !item.checked} : item
        );
        setYearFilter(updatedYearFilter);
    };
    const assetStorageTypeFilterHandler = (position: number) => {
        const updatedassetStorageTypeFilterHandler = assetStorageTypeFilter.map((item, index) =>
          index === position ? {field: item.field, checked: !item.checked} : item
        );
        setAssetStorageTypeFilter(updatedassetStorageTypeFilterHandler);
    };
    const contractHandler = (position: number) => {
        const updatedContractStandardFilter = contractStandardFilter.map((item, index) =>
          index === position ? {field: item.field, checked: !item.checked} : item
        );
        setContractStandardFilter(updatedContractStandardFilter);
    };



    return (
        <div className='home-8'>
            <Header />
            <section className="tf-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-box-17">
                            <SideBar yearFilter={yearFilter} yearHandler={yearHandler} assetStorageTypeFilterHandler={assetStorageTypeFilterHandler} assetStorageTypeFilter={assetStorageTypeFilter} contractStandardFilter={contractStandardFilter} contractStandardHandler={contractHandler} />
                        </div>

                        <div className="col-box-83">
                            <ItemContent yearFilter={yearFilter} assetStorageTypeFilter={assetStorageTypeFilter} contractStandardFilter={contractStandardFilter}  />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Explore;

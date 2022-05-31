import React, {useEffect, useState} from 'react';
import Header from '../components/header/HeaderStyle2';
import ItemContent from '../components/layouts/home-8/ItemContent';
import SideBar from '../components/layouts/home-8/SideBar';


const Explore = () => {
    const [isBusy, setBusy] = useState(true)
    const [year, setYear] = useState([
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
        },
        {
            field: '2020',
            checked: true
        },
        {
            field: '2021',
            checked: true
        },
    ])
    const [assetDataLocation, setAssetDataLocation] = useState<any[]>([])
    const [standard, setStandard] = useState<any[]>([])

    useEffect(() => {
        fetch('https://api.nftarchaeology.io/schema').then((response) => {
            response.json().then((data) => {
                const standards = []
                for (const standard of data.components.schemas.Standard.enum) {
                    standards.push({field: standard, checked: true})
                }
                setStandard(standards)

                const assetDataLocations = []
                for (const assetDataLocation of data.components.schemas.AssetDataLocation.enum) {
                    assetDataLocations.push({field: assetDataLocation, checked: true})
                }
                setAssetDataLocation(assetDataLocations)

                setBusy(false)
            })
        })
    }, [])


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



    return (
        <div className='home-8'>
            <Header />
            <section className="tf-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-box-17">
                            {isBusy ? (<>Loading...</>) : (
                            <SideBar year={year} yearHandler={yearHandler} assetDataLocationHandler={assetDataLocationHandler} assetDataLocation={assetDataLocation} standard={standard} standardHandler={standardHandler} />
                              )}
                        </div>
                        <div className="col-box-83">
                            <ItemContent year={year} assetDataLocation={assetDataLocation} standard={standard}  />
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Explore;

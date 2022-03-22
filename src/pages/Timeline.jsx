import React  from 'react';
import HeaderStyle2 from '../components/header/HeaderStyle2';
import Footer from '../components/footer/Footer';
import TimelineComponent from "../components/TimelineComponent";

const Timeline = () => {
    return (
        <div className='home-7'>
            <HeaderStyle2 />
            <section className="tf-item tf-section">
            <TimelineComponent />
            </section>
            {/*<LiveAuction />*/}
            {/*<Category />*/}
            {/*<TopSeller />*/}
            {/*<TodayPicks />*/}
            {/*<Create />*/}
            {/*<PopularCollection />*/}
            <Footer />
        </div>
    );
}

export default Timeline;

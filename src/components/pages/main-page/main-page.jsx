import Tabs from '../../tabs/tabs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import './main-page.sass';

const MainPage = () => {
  return (
    <>
      <Tabs />
      <div className="main-page">
        <Swiper
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            dynamicBullets: true,
          }}
          effect={'fade'}
          loop={true}
          modules={[EffectFade, Autoplay, Pagination]}
          className="promo-swiper"
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <SwiperSlide>Slide 5</SwiperSlide>
        </Swiper>
        <div className="highest-rated-items-block">
          <h1 className="highest-rated-items-block_title">
            Check our highest rated <span>exotic furniture</span>
          </h1>
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            loop={true}
            className="highest-rated-items-swiper"
          >
            <SwiperSlide>Slide 1</SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
            <SwiperSlide>Slide 5</SwiperSlide>
            <SwiperSlide>Slide 6</SwiperSlide>
            <SwiperSlide>Slide 7</SwiperSlide>
            <SwiperSlide>Slide 8</SwiperSlide>
            <SwiperSlide>Slide 9</SwiperSlide>
          </Swiper>
        </div>
        <div className="promo-sales">
          <div className="promo-sales_main" />
          <div className="promo-sales_secondary" />
        </div>
        <div className="sales-items-block">
          <h1 className="sales-items-block_title">
            Hurry to buy at <span>epic sales</span>
          </h1>
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            loop={true}
            className="highest-rated-items-swiper"
          >
            <SwiperSlide>Slide 1</SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
            <SwiperSlide>Slide 5</SwiperSlide>
            <SwiperSlide>Slide 6</SwiperSlide>
            <SwiperSlide>Slide 7</SwiperSlide>
            <SwiperSlide>Slide 8</SwiperSlide>
            <SwiperSlide>Slide 9</SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default MainPage;

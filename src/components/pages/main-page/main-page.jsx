import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import Slider from 'react-slick';

import Tabs from '../../tabs/tabs';
import { sortProducts } from '../../../utils';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './main-page.sass';
import CatalogItem from '../../catalog-item/catalog-item';

const MainPage = () => {
  const products = useSelector((state) => state.products);
  const highestRatedProducts = sortProducts(products, 'rating').slice(0, 10);
  const saleProducts = sortProducts(products, 'discount').slice(0, 10);

  console.log(highestRatedProducts);

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
          <Slider
            dots={true}
            infinite={true}
            slidesToShow={5}
            className="highest-rated-items-carousel"
          >
            {highestRatedProducts.map((it) => {
              return <CatalogItem key={it.id} item={it} />;
            })}
          </Slider>
        </div>
        <div className="promo-sales"></div>
        <div className="sales-items-block">
          <h1 className="sales-items-block_title">
            Hurry to buy at <span>epic sales</span>
          </h1>
          <Slider
            dots={true}
            infinite={true}
            slidesToShow={5}
            className="sale-items-carousel"
          >
            {saleProducts.map((it) => {
              return <CatalogItem ket={it.id} item={it} />;
            })}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default MainPage;

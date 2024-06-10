import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper/modules';
import Slider from 'react-slick';

import CatalogItem from '../../catalog-item/catalog-item';
import Tabs from '../../tabs/tabs';
import { sortProducts } from '../../../utils';
import useWindowSize from '../../../hooks/use-window-size';
import SearchPanel from '../../search-panel/search-panel';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './main-page.sass';

const MainPage = () => {
  const products = useSelector((state) => state.products);
  const highestRatedProducts = sortProducts(products, 'rating').slice(0, 10);
  const saleProducts = sortProducts(products, 'discount').slice(0, 10);
  const navigate = useNavigate();
  const [ww, wh] = useWindowSize();

  const getSlidesQty = (ww) => {
    if (ww >= 1600) {
      return 5;
    }
    if ((ww < 1600) & (ww >= 1200)) {
      return 4;
    }
    if ((ww < 1200) & (ww >= 768)) {
      return 3;
    }
    if (ww < 768) {
      return 2;
    }
    return 2;
  };

  return (
    <>
      {ww <= 768 ? <SearchPanel /> : null}
      <Tabs />
      <div className="main-page">
        <Swiper
          autoplay={{
            delay: 7500,
            disableOnInteraction: false,
          }}
          pagination={{
            dynamicBullets: true,
          }}
          effect={'fade'}
          loop={true}
          modules={[EffectFade, Autoplay, Pagination, Navigation]}
          navigation={ww > 768 ? true : false}
          className="promo-swiper"
        >
          <SwiperSlide
            onClick={() => navigate('/beds?new=true')}
            className="slide-1"
          />
          <SwiperSlide
            onClick={() => navigate('/beds?series=Classic')}
            className="slide-2"
          />
          <SwiperSlide
            onClick={() => navigate('/search?q=bear')}
            className="slide-3"
          />
          <SwiperSlide
            onClick={() => navigate('/beds?series=Cyberpunk')}
            className="slide-4"
          />
          <SwiperSlide
            onClick={() => navigate('/beds?series=Sea')}
            className="slide-5"
          />
          <SwiperSlide
            onClick={() => navigate('/search?q=sponge%20bob')}
            className="slide-6"
          />
        </Swiper>
        <div className="highest-rated-items-block">
          <h1 className="highest-rated-items-block_title">
            Check our highest rated <span>exotic furniture</span>
          </h1>
          <Slider
            dots={ww > 480 ? true : false}
            infinite={true}
            slidesToShow={getSlidesQty(ww)}
            className="highest-rated-items-carousel"
          >
            {highestRatedProducts.map((it) => {
              return <CatalogItem key={it.id} item={it} />;
            })}
          </Slider>
        </div>
        <Link to={'/beds?sale=true'}>
          <div className="promo-sales"></div>
        </Link>
        <div className="sales-items-block">
          <h1 className="sales-items-block_title">
            Hurry to buy at <span>epic sales</span>
          </h1>
          <Slider
            dots={ww > 480 ? true : false}
            infinite={true}
            slidesToShow={getSlidesQty(ww)}
            className="sale-items-carousel"
          >
            {saleProducts.map((it) => {
              return <CatalogItem key={it.id} item={it} />;
            })}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default MainPage;

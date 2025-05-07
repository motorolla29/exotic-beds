import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper/modules';
import Slider from 'react-slick';

import { getProducts } from '../../../api/productAPI';
import CatalogItem from '../../catalog-item/catalog-item';
import Tabs from '../../tabs/tabs';
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
  const [highestRatedProducts, setHighestRatedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);

  const navigate = useNavigate();
  const [ww] = useWindowSize();

  useEffect(() => {
    const fetchSliderProducts = async () => {
      try {
        // Запрос 1: по рейтингу
        const topRatedProducts = await getProducts({
          page: 1,
          limit: 10,
          sortBy: 'rating',
        });
        setHighestRatedProducts(topRatedProducts.items);

        // Запрос 2: по скидке
        const saleProducts = await getProducts({
          page: 1,
          limit: 10,
          sortBy: 'discount',
        });
        setSaleProducts(saleProducts.items);
      } catch (err) {
        console.error('Error loading products for slider:', err);
      }
    };

    fetchSliderProducts();
  }, []);

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
            onClick={() => navigate('/store-finder')}
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
          <SwiperSlide
            onClick={() => navigate('/beds?series=Classic')}
            className="slide-7"
          />
        </Swiper>
        <div className="highest-rated-items-block">
          <h1 className="highest-rated-items-block_title">
            Check our highest rated <span>exotic furniture</span>
          </h1>
          {highestRatedProducts.length && (
            <Slider
              dots={ww > 480 ? true : false}
              infinite={true}
              slidesToShow={getSlidesQty(ww)}
              className="highest-rated-items-carousel"
            >
              {highestRatedProducts.map((it) => {
                return (
                  <CatalogItem key={it.id} item={{ ...it, productId: it.id }} />
                );
              })}
            </Slider>
          )}
        </div>
        <Link to={'/beds?sale=true'}>
          <div className="promo-sales"></div>
        </Link>
        <div className="sales-items-block">
          <h1 className="sales-items-block_title">
            Hurry to buy at <span>epic sales</span>
          </h1>
          {saleProducts.length && (
            <Slider
              dots={ww > 480 ? true : false}
              infinite={true}
              slidesToShow={getSlidesQty(ww)}
              className="sale-items-carousel"
            >
              {saleProducts.map((it) => {
                return (
                  <CatalogItem key={it.id} item={{ ...it, productId: it.id }} />
                );
              })}
            </Slider>
          )}
        </div>
      </div>
    </>
  );
};

export default MainPage;

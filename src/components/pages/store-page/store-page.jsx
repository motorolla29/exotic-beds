import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import stores from '../../../data/exotic-beds-stores';

import './store-page.sass';

const StorePage = () => {
  const { id } = useParams();
  const store = stores.features.find((it) => it.properties.id === id);

  return (
    <div className="store-page">
      <Breadcrumbs
        last={`${store.properties.name}, ${store.properties.address}, ${store.properties.city}`}
      />
      <div className="store-page_info">INFO</div>
      <div className="store-page_image">IMAGE</div>
    </div>
  );
};

export default StorePage;

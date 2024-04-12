import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import StoreFinder from '../../store-finder/store-finder';

import './store-finder-page.sass';

const StoreFinderPage = () => {
  return (
    <div className="store-finder-page">
      <Breadcrumbs />
      <StoreFinder />
    </div>
  );
};

export default StoreFinderPage;

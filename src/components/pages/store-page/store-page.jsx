import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

import './store-page.sass';

const StorePage = () => {
  return (
    <div className="store-page">
      <Breadcrumbs last="store" />
      <div className="store-page_info">INFO</div>
      <div className="store-page_image">IMAGE</div>
    </div>
  );
};

export default StorePage;

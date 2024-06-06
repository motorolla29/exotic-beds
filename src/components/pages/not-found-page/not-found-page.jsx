import { Link } from 'react-router-dom';

import './not-found-page.sass';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1 className="not-found_title">404</h1>
      <h2 className="not-found_subtitle">Page not found</h2>
      <Link className="not-found_link" to="/">
        Go to main page
      </Link>
    </div>
  );
};

export default NotFoundPage;

import { Link } from 'react-router-dom';

import './not-found-page.sass'

function NotFoundPage() {
    return (
      <section className="not-found">
        <h1 className="not-found_title">
          404. <br />
          Page not found
        </h1>
        <Link className="not-found_link" to={}>
          Go to main page
        </Link>
      </section>
    );
  }
  
  export default NotFoundPage;
  
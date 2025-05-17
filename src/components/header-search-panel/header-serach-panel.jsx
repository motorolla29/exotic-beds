import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ReactComponent as SearchIcon } from '../../images/ui-icons/search-icon.svg';

import './header-search-panel.sass';

const HeaderSearchPanel = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const inputRef = useRef(null);

  const q = searchParams.get('q') || '';

  const [search, setSearch] = useState(q);

  const formHandleSubmit = (e) => {
    e.preventDefault();

    const query = e.target.search.value.trim();

    if (query) {
      inputRef.current?.blur();
      navigate(`/search?q=${query}`);
    }
  };

  useEffect(() => {
    setSearch(q);
  }, [q]);

  return (
    <form onSubmit={formHandleSubmit} className="header-search-form">
      <button type="submit" className="header-search-form_button">
        <SearchIcon />
      </button>
      <input
        ref={inputRef}
        type="search"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`header-search-form_input ${
          search.trim() ? 'expanded' : ''
        }`}
      />
    </form>
  );
};

export default HeaderSearchPanel;

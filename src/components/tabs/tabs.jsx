import { NavLink } from 'react-router-dom';

import './tabs.sass';

const Tabs = () => {
  return (
    <div className="tabs">
      <NavLink to="/beds">Beds</NavLink>
      <NavLink to="/sofas">Sofas</NavLink>
      <NavLink to="/armchairs">Armchairs</NavLink>
      <NavLink to="/poofs">Poofs</NavLink>
      <NavLink to="/kids">Kids</NavLink>
    </div>
  );
};

export default Tabs;

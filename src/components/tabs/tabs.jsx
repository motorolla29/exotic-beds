import { NavLink } from 'react-router-dom';

import { ReactComponent as BedIcon } from '../../images/categories-icons/bed.svg';
import { ReactComponent as SofaIcon } from '../../images/categories-icons/sofa.svg';
import { ReactComponent as ArmchairIcon } from '../../images/categories-icons/armchair.svg';
import { ReactComponent as CribIcon } from '../../images/categories-icons/crib.svg';
import { ReactComponent as PoofIcon } from '../../images/categories-icons/poof.svg';

import './tabs.sass';

const Tabs = () => {
  return (
    <div className="tabs">
      <NavLink className="tabs_link" to="/beds">
        <BedIcon className="tabs_link_bed" />
        <p className="tabs_link_title">Beds</p>
      </NavLink>
      <NavLink className="tabs_link" to="/sofas">
        <SofaIcon className="tabs_link_sofa" />
        <p className="tabs_link_title">Sofas</p>
      </NavLink>
      <NavLink className="tabs_link" to="/armchairs">
        <ArmchairIcon className="tabs_link_armchair" />
        <p className="tabs_link_title">Armchairs</p>
      </NavLink>
      <NavLink className="tabs_link" to="/kids">
        <CribIcon className="tabs_link_crib" />
        <p className="tabs_link_title">Kids</p>
      </NavLink>
      <NavLink className="tabs_link" to="/poofs">
        <PoofIcon className="tabs_link_poof" />
        <p className="tabs_link_title">Poofs</p>
      </NavLink>
    </div>
  );
};

export default Tabs;

import { ReactComponent as EBLogoNoTextSvg } from '../../images/spinner-logo/EB-LOGO-NO-TEXT.svg';
import BeatLoader from 'react-spinners/BeatLoader';

import './catalog-logo-spinner.sass';

const CatalogLogoSpinner = () => {
  return (
    <div className="catalog-logo-spinner">
      <EBLogoNoTextSvg />
      <BeatLoader
        className="catalog-logo-spinner_loader"
        speedMultiplier={0.6}
      />
    </div>
  );
};

export default CatalogLogoSpinner;

import { ReactComponent as EBLogoNoTextSvg } from '../../images/spinner-logo/EB-LOGO-NO-TEXT.svg';
import BeatLoader from 'react-spinners/BeatLoader';

import './logo-spinner.sass';

const LogoSpinner = () => {
  return (
    <div className="logo-spinner">
      <EBLogoNoTextSvg />
      <BeatLoader className="logo-spinner_loader" speedMultiplier={0.6} />
    </div>
  );
};

export default LogoSpinner;

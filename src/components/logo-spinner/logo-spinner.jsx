import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import { ReactComponent as EBLogoNoTextSvg } from '../../images/spinner-logo/EB-LOGO-NO-TEXT.svg';
import BeatLoader from 'react-spinners/BeatLoader';
import { scrollController } from '../../utils';

import variables from '../../styles/variables.sass';
import './logo-spinner.sass';

const LogoSpinner = () => {
  const loading = useSelector((state) => state.overlayLoader);

  useEffect(() => {
    if (loading) {
      scrollController.disabledScroll();
    } else {
      scrollController.enabledScroll();
    }
  }, [loading]);

  const ww = window.innerWidth;
  let logoSize, loaderSize, pointsMargin, pointsSize;

  if (ww < 480) {
    logoSize = '100px';
    loaderSize = 'small';
    pointsMargin = 2;
    pointsSize = 16;
  }
  if (ww >= 480 && ww <= 992) {
    logoSize = '150px';
    loaderSize = 'medium';
    pointsMargin = 3;
    pointsSize = 24;
  }
  if (ww > 992) {
    logoSize = '200px';
    loaderSize = 'large';
    pointsMargin = 4;
    pointsSize = 32;
  }

  return (
    loading && (
      <div className="logo-spinner_shadow">
        <div className="logo-spinner">
          <EBLogoNoTextSvg
            className="logo-spinner_svg"
            style={{ width: `${logoSize}` }}
          />
          <BeatLoader
            className={`logo-spinner_loader ${loaderSize}`}
            color={variables.mainColorGreenLight}
            size={pointsSize}
            speedMultiplier={0.75}
            margin={pointsMargin}
          />
        </div>
      </div>
    )
  );
};

export default LogoSpinner;

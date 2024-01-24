import { Link } from 'react-router-dom';

import { ReactComponent as FacebookIcon } from '../../images/socials-icons/facebook_icon-icons.com_53612.svg';
import { ReactComponent as TwitterIcon } from '../../images/socials-icons/twitter_icon-icons.com_66093.svg';
import { ReactComponent as PinterestIcon } from '../../images/socials-icons/pinterest_logo_icon_147250.svg';
import { ReactComponent as YoutubeIcon } from '../../images/socials-icons/icons8-youtube.svg';
import { ReactComponent as InstagramIcon } from '../../images/socials-icons/iconfinder-social-media-applications-3instagram-4102579_113804.svg';

import { ReactComponent as VisaIcon } from '../../images/payment-options-icons/Visa_icon-icons.com_60549.svg';
import { ReactComponent as MastercardIcon } from '../../images/payment-options-icons/Mastercard_icon-icons.com_60554.svg';
import { ReactComponent as GooglePayIcon } from '../../images/payment-options-icons/google_pay_icon_195967.svg';
import { ReactComponent as ApplePayIcon } from '../../images/payment-options-icons/apple_pay_icon_195995.svg';
import { ReactComponent as AmericanExpressIcon } from '../../images/payment-options-icons/8365-american-express_102492.svg';
import { ReactComponent as PayPalIcon } from '../../images/payment-options-icons/Paypal-39_icon-icons.com_60555.svg';

import { ReactComponent as StoreFinderIcon } from '../../images/ui-icons/pin-icon.svg';

import './footer.sass';

function Footer() {
  return (
    <div className="footer">
      <div className="footer_first-level">
        <div className="footer_first-level_socials">
          <Link to="">
            <FacebookIcon />
          </Link>
          <Link to="">
            <TwitterIcon />
          </Link>
          <Link to="">
            <InstagramIcon />
          </Link>
          <Link to="">
            <PinterestIcon />
          </Link>
          <Link to="">
            <YoutubeIcon />
          </Link>
        </div>
        <Link
          to="/store-finder"
          className="footer_first-level_store-finder-link"
        >
          <StoreFinderIcon />
          <div className="footer_first-level_store-finder-link_signature">
            <p className="footer_first-level_store-finder-link_signature_title">
              Visit a store
            </p>
            <p className="footer_first-level_store-finder-link_signature_subtitle">
              Over 100 stores nationwide
            </p>
          </div>
        </Link>
      </div>

      <div className="footer_line" />
      <div className="footer_second-level">
        <div className="footer_second-level_ways-to-pay">
          <p className="footer_second-level_ways-to-pay_title">Ways to pay:</p>
          <VisaIcon />
          <MastercardIcon />
          <GooglePayIcon />
          <ApplePayIcon />
          <AmericanExpressIcon />
          <PayPalIcon />
        </div>
      </div>

      <div className="footer_line" />

      <div className="footer_copyright">
        © 2024 Designed and developed by Motorolla29
      </div>
    </div>
  );
}

export default Footer;

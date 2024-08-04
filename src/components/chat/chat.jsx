import { memo, useEffect, useRef, useState } from 'react';
import { ReactComponent as CrossIcon } from '../../images/ui-icons/cross-icon.svg';
import { ReactComponent as ChatIcon } from '../../images/ui-icons/chat-icon.svg';
import { AnimatePresence, motion } from 'framer-motion';
import useSound from 'use-sound';
import uvedomlenie from '../../sounds/uvedomlenie14.mp3';
import { ReactComponent as Logo } from '../../images/logo/EB-LOGO-NO-TEXT.svg';
import { ReactComponent as CheckmarkIcon } from '../../images/checkmark.svg';
import { useForm } from '@formspree/react';
import BeatLoader from 'react-spinners/BeatLoader';

import './chat.sass';

const Chat = () => {
  const [play] = useSound(uvedomlenie);

  const [state, handleSubmit] = useForm('moqggkvy');
  const [sent, setSent] = useState(false);

  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [messageValid, setMessageValid] = useState(false);
  const [nameFilled, setNameFilled] = useState(false);
  const [emailFilled, setEmailFilled] = useState(false);
  const [messageFilled, setMessageFilled] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef();

  const ChatIconMotion = motion(ChatIcon);
  const CrossIconMotion = motion(CrossIcon);
  const CheckmarkIconMotion = motion(CheckmarkIcon);

  const onNameChange = (e) => {
    e.target.value ? setNameFilled(true) : setNameFilled(false);
    if (/^[а-яА-ЯёЁa-zA-Z0-9-]{3,}$/.test(e.target.value)) {
      setNameValid(true);
    } else {
      setNameValid(false);
    }
  };
  const onEmailChange = (e) => {
    e.target.value ? setEmailFilled(true) : setEmailFilled(false);
    if (
      /^[-a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-zA-Z0-9]([-a-zA-Z0-9]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,18})$/.test(
        e.target.value
      )
    ) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };
  const onMessageChange = (e) => {
    e.target.value ? setMessageFilled(true) : setMessageFilled(false);
    if (/^[\s\S]{10,}$/.test(e.target.value)) {
      setMessageValid(true);
    } else {
      setMessageValid(false);
    }
  };
  const onWindowInterationHandler = () => {
    setInteracted(true);
  };
  const onWindowClickHandler = (e) => {
    if (chatRef.current && !chatRef.current.contains(e.target))
      setChatOpen(false);
  };

  useEffect(() => {
    setNameValid(false);
    setEmailValid(false);
    setMessageValid(false);
    setNameFilled(false);
    setEmailFilled(false);
    setMessageFilled(false);
  }, [chatOpen]);

  useEffect(() => {
    window.addEventListener('keydown', onWindowInterationHandler);
    window.addEventListener('mouseup', onWindowInterationHandler);
    return () => {
      window.removeEventListener('keydown', onWindowInterationHandler);
      window.removeEventListener('mouseup', onWindowInterationHandler);
    };
  });

  useEffect(() => {
    play();
  }, [interacted]);

  useEffect(() => {
    window.addEventListener('mousedown', onWindowClickHandler);
    return () => window.removeEventListener('mousedown', onWindowClickHandler);
  });

  return (
    interacted && (
      <motion.div
        ref={chatRef}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.5, 1], scale: [0.5, 1.5, 1] }}
        transition={{ duration: 0.8, times: [0.2, 0.4, 0.6], type: 'easeIn' }}
        onClick={() => {
          setChatOpen(!chatOpen);
          state.succeeded ? setSent(true) : setSent(false);
        }}
        className="chat"
      >
        {chatOpen ? (
          <CrossIconMotion
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: 'easeIn' }}
            className="cross-icon"
          />
        ) : (
          <ChatIconMotion
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: 'easeIn' }}
            className="chat-icon"
          />
        )}

        <AnimatePresence>
          {chatOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="contacts-container"
            >
              <Logo className="logo" />
              <h3 className="title">Contact Us</h3>
              {state.succeeded ? (
                <div className="form-succeeded-sent">
                  {sent ? (
                    <>
                      <CheckmarkIcon className="form-succeeded-sent_icon" />
                      <p className="form-succeeded-sent_title">
                        Thank you for contacting us!
                      </p>
                      <p className="form-succeeded-sent_description">
                        We will give you feedback soon...
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckmarkIconMotion
                        className="form-succeeded-sent_icon"
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                      />
                      <motion.p
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: 'spring',
                          damping: 10,
                          stiffness: 100,
                          duration: 0.1,
                          delay: 1,
                        }}
                        className="form-succeeded-sent_title"
                      >
                        Thank you for contacting us!
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: 'spring',
                          damping: 10,
                          stiffness: 100,
                          duration: 0.1,
                          delay: 1.8,
                        }}
                        className="form-succeeded-sent_description"
                      >
                        We will give you feedback soon...
                      </motion.p>
                    </>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <motion.input
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 14,
                      stiffness: 100,
                      duration: 0.4,
                    }}
                    className={`contact-form_name-input ${
                      nameFilled && nameValid ? 'valid' : ''
                    } ${nameFilled && !nameValid ? 'invalid' : ''}`}
                    onChange={onNameChange}
                    name="name"
                    placeholder="Your name"
                  />
                  {nameFilled && !nameValid && (
                    <span className="contact-form_error">
                      The name must consist of at least 3 letters
                    </span>
                  )}
                  <motion.input
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 12,
                      stiffness: 100,
                      duration: 0.4,
                      delay: 0.1,
                    }}
                    className={`contact-form_email-input ${
                      emailFilled && emailValid ? 'valid' : ''
                    } ${emailFilled && !emailValid ? 'invalid' : ''}`}
                    onChange={onEmailChange}
                    name="email"
                    placeholder="Your email"
                  />
                  {emailFilled && !emailValid && (
                    <span className="contact-form_error">
                      Email must contain the @ sign and the domain name
                    </span>
                  )}
                  <motion.textarea
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 10,
                      stiffness: 100,
                      duration: 0.4,
                      delay: 0.2,
                    }}
                    className={`contact-form_message-input ${
                      messageFilled && messageValid ? 'valid' : ''
                    } ${messageFilled && !messageValid ? 'invalid' : ''}`}
                    onChange={onMessageChange}
                    name="message"
                    placeholder="You can ask us any questions and we will contact you"
                  />
                  {messageFilled && !messageValid && (
                    <span className="contact-form_error">
                      Your question must be at least 10 letters long
                    </span>
                  )}
                  <motion.button
                    initial={{ y: 90 }}
                    animate={{ y: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 8,
                      stiffness: 100,
                      duration: 0.4,
                      delay: 0.3,
                    }}
                    className={`contact-form_submit-button ${
                      !nameValid || !emailValid || !messageValid
                        ? 'disabled'
                        : ''
                    }`}
                    type="submit"
                    disabled={
                      state.submitting ||
                      !nameValid ||
                      !emailValid ||
                      !messageValid
                    }
                  >
                    {state.submitting ? (
                      <BeatLoader
                        className="contact-form_submit-button_loader"
                        color="#e8e8e8 "
                        size={8}
                        speedMultiplier={0.75}
                        margin={4}
                      />
                    ) : (
                      'Send'
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    )
  );
};

export default memo(Chat);

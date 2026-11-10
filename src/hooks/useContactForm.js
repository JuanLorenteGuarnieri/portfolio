import { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_4bprkd7';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_ri6j7pk';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'PIjQsVkt3UW5dD4Vy';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const NAME_REGEX = /^[a-zA-Z0-9 ]+$/;

export function useContactForm() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [colorFeedback, setColorFeedback] = useState(0x5cae5e);

  const changeUserName = useCallback((value) => {
    setUserName(value);
  }, []);

  const changeUserEmail = useCallback((value) => {
    setUserEmail(value);
  }, []);

  const changeMessage = useCallback((value) => {
    setMessage(value);
  }, []);

  const sendEmail = useCallback(() => {
    if (userName === '' || userEmail === '' || message === '') {
      setFeedback('Complete all the fields');
      setColorFeedback(0xff4440);
      return;
    }

    if (!EMAIL_REGEX.test(userEmail)) {
      setFeedback('The email is not valid');
      setColorFeedback(0xff4440);
      return;
    }

    if (!NAME_REGEX.test(userName)) {
      setFeedback('The username is not valid');
      setColorFeedback(0xff4440);
      return;
    }

    const templateParams = {
      user_name: userName,
      user_email: userEmail,
      message,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        setFeedback('Email sent');
        setColorFeedback(0x5cae5e);
        setUserName('');
        setUserEmail('');
        setMessage('');
        setTimeout(() => {
          setFeedback('');
        }, 5000);
      }, (error) => {
        setFeedback(error.text || 'Email could not be sent');
        setColorFeedback(0xff4440);
      });
  }, [message, userEmail, userName]);

  return {
    userName,
    userEmail,
    message,
    feedback,
    colorFeedback,
    changeUserName,
    changeUserEmail,
    changeMessage,
    sendEmail,
  };
}

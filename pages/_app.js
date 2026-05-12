import '../styles/globals.css';
import FeedbackButton from '../components/FeedbackButton';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <FeedbackButton />
    </>
  );
}

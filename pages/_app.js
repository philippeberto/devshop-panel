import 'tailwindcss/tailwind.css';

function Panel({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default Panel;
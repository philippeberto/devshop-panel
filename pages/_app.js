import 'tailwindcss/tailwind.css';

function Panel({ Component, pageProps }) {
  return (
    <>
      <div>
        <h1 className="">DevShop</h1>
      </div>
      <Component {...pageProps} />
    </>
  );
}

export default Panel;
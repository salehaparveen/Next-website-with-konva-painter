import { Fragment, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Layout from "../components/layout/layout";
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    const a = document.createElement('script');
    a.src = "https://unpkg.com/konva@8.4.2/konva.min.js"

    document.head.appendChild(a);
  }, [])
  return (
    <SessionProvider session={session}>
      <Fragment>
        <Layout>
          <NextNProgress color="#7cbf05" />
          <Component {...pageProps} />
        </Layout>
      </Fragment>
    </SessionProvider>
  );
}

export default MyApp;

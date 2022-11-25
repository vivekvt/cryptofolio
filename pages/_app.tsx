import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider as ReduxProvider } from "react-redux";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import { store } from "../src/redux/store";
import { appConfig } from "../src/config/appConfig";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{appConfig?.title}</title>
        <meta property="og:title" content={appConfig.title} />
        <meta property="og:image" content="/cryptofolio.png" />
        <meta property="og:url" content={appConfig.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:description" content={appConfig.description} />
        <meta property="og:site_name" content={appConfig.title} />
        <meta name="twitter:image:alt" content={appConfig.title} />
      </Head>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ReduxProvider>
    </CacheProvider>
  );
}

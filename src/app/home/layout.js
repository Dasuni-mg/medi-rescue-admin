'use client';

import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import themes from 'themes';

import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('layout/main-layout'), { ssr: false });

export default function ManageLayout({ children }) {
  const queryClient = new QueryClient();

  useEffect(() => {
    i18n
      .use(Backend)
      // .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        debug: true,
        interpolation: {
          escapeValue: false // not needed for react as it escapes by default
        }
        // backend: {
        //   loadPath: 'locales/{{lng}}/{{ns}}.json'
        // }
      });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themes()}>
            <CssBaseline />
            <ToastContainer />
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

ManageLayout.propTypes = {
  children: PropTypes.node.isRequired
};

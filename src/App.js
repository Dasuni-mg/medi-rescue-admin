// import { CssBaseline, StyledEngineProvider } from '@mui/material';
// import { ThemeProvider } from '@mui/material/styles';
// import { Provider } from 'react-redux';
// import { store } from './store/index';
// import dynamic from 'next/dynamic';

// const BrowserRouter = dynamic(() => import('react-router-dom').then((mod) => mod.BrowserRouter), { ssr: false });

// // routing
// import Routes from 'routes';

// // defaultTheme
// import themes from 'themes';

// // project imports
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ConfirmationProvider } from 'hooks/useConfirmation';
// import NavigationScroll from 'layout/navigation-scroll';
// import { ToastContainer } from 'react-toastify';
// import CommonConfirmBox from './ui-component/extended/confirmation-dialog';
// import { I18nextProvider } from 'react-i18next';
// import i18n from 'i18n';

// // ==============================|| APP ||============================== //

// const App = () => {
//   const queryClient = new QueryClient();

//   return (
//     <BrowserRouter basename={''}>
//       <StyledEngineProvider injectFirst>
//         <Provider store={store}>
//           <I18nextProvider i18n={i18n}>
//             <QueryClientProvider client={queryClient}>
//               <ThemeProvider theme={themes()}>
//                 <CssBaseline />
//                 <NavigationScroll>
//                   <ToastContainer />
//                   <ConfirmationProvider>
//                     <Routes />
//                     <CommonConfirmBox />
//                   </ConfirmationProvider>
//                 </NavigationScroll>
//               </ThemeProvider>
//             </QueryClientProvider>
//           </I18nextProvider>
//         </Provider>
//       </StyledEngineProvider>
//     </BrowserRouter>
//   );
// };

// export default App;

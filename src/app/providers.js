// 'use client';
// import config from 'config';
// import dynamic from 'next/dynamic';
// import PropTypes from 'prop-types';
// import { Provider } from 'react-redux';
// import { store } from 'store';

// const BrowserRouter = dynamic(() => import('react-router-dom').then((mod) => mod.BrowserRouter), { ssr: false });

// /**
//  * Provides a context for the entire application. This context includes
//  * the store, basename and BrowserRouter from react-router-dom.
//  *
//  * @param {Object} props Properties passed from the parent component.
//  * @param {ReactNode} props.children Children components of the layout.
//  * @returns {ReactElement} The root layout of the application.
//  */
// export function Providers({ children }) {
//   Providers.propTypes = {
//     /**
//      * Children components of the layout.
//      */
//     children: PropTypes.node.isRequired
//   };

//   return (
//     // <Provider store={store}>
//     <BrowserRouter basename={''}>{children}</BrowserRouter>
//     // </Provider>
//   );
// }

// import MinimalLayout from 'layout/minimal-layout';
// import { lazy } from 'react';
// import { Navigate } from 'react-router';
// import Loadable from 'ui-component/loadable';
// import { ProtectedGuard } from './protected-guard';

// // ==============================|| IFRAME ROUTING ||============================== //
// const Home = Loadable(lazy(() => import('views/home/Home')));

// const IFrameRoutes = {
//   path: '/iframe',
//   element: (
//     <ProtectedGuard>
//       <MinimalLayout />
//     </ProtectedGuard>
//   ),
//   children: [
//     {
//       index: true,
//       element: <Navigate to="manage/home" />
//     },
//     {
//       path: 'manage',
//       children: [
//         {
//           path: 'home',
//           element: <Home />
//         }
//       ]
//     }
//   ]
// };

// export default IFrameRoutes;

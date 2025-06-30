// import { lazy } from 'react';

// // project imports
// import MainLayout from 'layout/main-layout';
// import { Navigate } from 'react-router-dom';
// import Loadable from 'ui-component/loadable';

// // page routing
// const Home = Loadable(lazy(() => import('views/home/home')));

// //New routings
// const Locations = Loadable(lazy(() => import('views/locations/location')));
// const Devices = Loadable(lazy(() => import('views/devices/devices')));
// const Groups = Loadable(lazy(() => import('views/groups/groups')));
// const Organizations = Loadable(lazy(() => import('views/organizations/organizations')));
// const SystemRoles = Loadable(lazy(() => import('views/system-roles/system-roles')));
// const EndUsers = Loadable(lazy(() => import('views/end-users/end-users')));
// const Vehicles = Loadable(lazy(() => import('views/vehicles/vehicles')));
// const Incidents = Loadable(lazy(() => import('views/incidents/incidents')));
// const CreateIncident = Loadable(lazy(() => import('views/incidents/create-incidents')));

// // ==============================|| MAIN ROUTING ||============================== //

// import { ProtectedGuard } from './protected-guard';

// const MainRoutes = {
//   path: '/',
//   element: <MainLayout />,
//   children: [
//     {
//       index: true,
//       element: <Navigate to="home" />
//     },
//     {
//       path: 'home',
//       element: (
//         <ProtectedGuard>
//           <Home />
//         </ProtectedGuard>
//       )
//     },
//     {
//       path: 'manage',
//       children: [
//         // Protected Routes
//         {
//           path: 'vehicles',
//           element: (
//             <ProtectedGuard>
//               <Vehicles />
//             </ProtectedGuard>
//           )
//         },
//         {
//           path: 'locations',
//           element: (
//             <ProtectedGuard>
//               <Locations />
//             </ProtectedGuard>
//           )
//         },
//         {
//           path: 'devices',
//           element: (
//             <ProtectedGuard>
//               <Devices />
//             </ProtectedGuard>
//           )
//         },
//         {
//           path: 'organizations',
//           element: (
//             <ProtectedGuard>
//               <Organizations />
//             </ProtectedGuard>
//           )
//         },
//         {
//           path: 'system-roles',
//           element: (
//             <ProtectedGuard>
//               <SystemRoles />
//             </ProtectedGuard>
//           )
//         },
//         {
//           path: 'end-users',
//           element: (
//             <ProtectedGuard>
//               <EndUsers />
//             </ProtectedGuard>
//           )
//         },
//         // Additional Protected Routes
//         {
//           path: 'incidents',
//           element: (
//             <ProtectedGuard>
//               <Incidents />
//             </ProtectedGuard>
//           )
//         },
//         {
//           path: 'create-incidents',
//           element: (
//             <ProtectedGuard>
//               <CreateIncident />
//             </ProtectedGuard>
//           )
//         },
//         {
//           path: 'groups',
//           element: (
//             <ProtectedGuard>
//               <Groups />
//             </ProtectedGuard>
//           )
//         }
//       ]
//     }
//   ]
// };

// export default MainRoutes;

// assets
import {
  IconBuildingHospital,
  IconCar,
  IconCreditCard,
  IconHeartRateMonitor,
  IconHome,
  IconLocation,
  IconMapPin,
  IconNotes,
  IconStethoscope,
  IconUser,
  IconUsers,
  IconUsersGroup
} from '@tabler/icons-react';
import { hasPermission } from '../../utils/permission';

// constant
const icons = {
  IconHeartRateMonitor,
  IconBuildingHospital,
  IconCar,
  IconHome,
  IconMapPin,
  IconUsers,
  IconUsersGroup,
  IconLocation,
  IconStethoscope,
  IconUser,
  IconCreditCard,
  IconNotes
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const manage = {
  id: 'manage-app-menu',
  title: '',
  type: 'group',
  children: [
    {
      id: 'incidents',
      title: 'Incidents',
      type: 'item',
      url: '/manage/incidents',
      icon: icons.IconStethoscope,
      breadcrumbs: false
    },
    {
      id: 'vehicles',
      title: 'Vehicles',
      type: 'item',
      url: '/manage/vehicles',
      icon: icons.IconCar,
      breadcrumbs: false,
      visible: hasPermission('smtadmin_vehicle.list') || hasPermission('smtadmin_vehicle.listAny')
    },
    // {
    //   id: 'locations',
    //   title: 'Locations',
    //   type: 'item',
    //   url: '/manage/locations',
    //   icon: icons.IconMapPin,
    //   breadcrumbs: false
    // },
    {
      id: 'devices',
      title: 'Devices',
      type: 'item',
      url: '/manage/devices',
      icon: icons.IconHeartRateMonitor,
      breadcrumbs: false,
      visible: hasPermission('smtadmin_device.list') || hasPermission('smtadmin_device.listAny')
    },
    {
      id: 'organizations',
      title: 'Organizations',
      type: 'item',
      url: '/manage/organizations',
      icon: icons.IconBuildingHospital,
      breadcrumbs: false,
      visible: hasPermission('smtadmin_organization.list') || hasPermission('smtadmin_organization.listAny')
    },
    {
      id: 'groups',
      title: 'Groups',
      type: 'item',
      url: '/manage/groups',
      icon: icons.IconUsersGroup,
      breadcrumbs: false,
      visible: hasPermission('smtadmin_tenant.list')
    },
    {
      id: 'users',
      title: 'User',
      type: 'item',
      external: true,
      url: 'https://im-smtadm.mediwave.io/',
      icon: icons.IconUser,
      breadcrumbs: false
      // children: [
      //   {
      //     id: 'tabler-icons',
      //     title: 'System Roles',
      //     type: 'item',
      //     url: '/manage/system-roles',
      //     icon: icons.IconUsersGroup,
      //     breadcrumbs: false
      //   },
      //   {
      //     id: 'end-users',
      //     title: 'End Users',
      //     type: 'item',
      //     url: '/manage/end-users',
      //     icon: icons.IconUsers,
      //     breadcrumbs: false
      //   }
      // ]
    }
  ].filter((item) => item.visible !== false)
};

export default manage;

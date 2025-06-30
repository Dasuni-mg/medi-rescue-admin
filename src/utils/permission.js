// src/utils/permission.js
'use client';

const getUserPermissions = () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData).permissions;
  }
  return [];
};

const hasPermission = (permissionCode) => {
  const userPermissions = getUserPermissions();
  return userPermissions.some((permission) => permission.code === permissionCode);
};

export { hasPermission };

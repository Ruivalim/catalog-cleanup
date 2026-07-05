import { createPermission } from '@backstage/plugin-permission-common';

export const catalogCleanupViewPermission = createPermission({
  name: 'catalog.cleanup.view',
  attributes: {
    action: 'read',
  },
});

export const catalogCleanupDeletePermission = createPermission({
  name: 'catalog.cleanup.delete',
  attributes: {
    action: 'delete',
  },
});

export const catalogCleanupPermissions = [
  catalogCleanupViewPermission,
  catalogCleanupDeletePermission,
];

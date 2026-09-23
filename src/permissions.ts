import { createPermission } from '@backstage/plugin-permission-common';

/**
 * @deprecated Not checked anywhere. Access is governed by the catalog's own
 * `catalog.location.read` and `catalog.location.delete` permissions.
 */
export const catalogCleanupViewPermission = createPermission({
  name: 'catalog.cleanup.view',
  attributes: {
    action: 'read',
  },
});

/**
 * @deprecated Not checked anywhere. Deleting a location is governed by the
 * catalog's own `catalog.location.delete` permission.
 */
export const catalogCleanupDeletePermission = createPermission({
  name: 'catalog.cleanup.delete',
  attributes: {
    action: 'delete',
  },
});

/**
 * @deprecated See {@link catalogCleanupViewPermission}.
 */
export const catalogCleanupPermissions = [
  catalogCleanupViewPermission,
  catalogCleanupDeletePermission,
];

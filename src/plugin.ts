import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const catalogCleanupPlugin = createPlugin({
  id: 'catalog-cleanup',
  routes: {
    root: rootRouteRef,
  },
});

export const CatalogCleanupPage = catalogCleanupPlugin.provide(
  createRoutableExtension({
    name: 'CatalogCleanupPage',
    component: () =>
      import('./components').then(m => m.CatalogCleanupPage),
    mountPoint: rootRouteRef,
  }),
);

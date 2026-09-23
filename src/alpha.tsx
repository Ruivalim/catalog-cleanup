import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import { rootRouteRef } from './routes';

const catalogCleanupPage = PageBlueprint.make({
  params: {
    path: '/catalog-cleanup',
    title: 'Catalog Cleanup',
    icon: <DeleteSweepIcon />,
    routeRef: rootRouteRef,
    loader: () =>
      import('./components').then(m => <m.CatalogCleanupPage />),
  },
});

/**
 * Catalog Cleanup plugin for the new frontend system.
 *
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'catalog-cleanup',
  title: 'Catalog Cleanup',
  icon: <DeleteSweepIcon />,
  extensions: [catalogCleanupPage],
  routes: {
    root: rootRouteRef,
  },
});

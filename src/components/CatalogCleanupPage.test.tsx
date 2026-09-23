import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import { alertApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { mockApis, renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { CatalogCleanupPage } from './CatalogCleanupPage';

const locations = [
  { id: 'loc-1', type: 'url', target: 'https://example.com/a/catalog-info.yaml' },
  { id: 'loc-2', type: 'url', target: 'https://example.com/b/catalog-info.yaml' },
];

describe('CatalogCleanupPage', () => {
  let catalogApi: { getLocations: jest.Mock; removeLocationById: jest.Mock };
  let alertApi: { post: jest.Mock; alert$: jest.Mock };
  let authorize: jest.SpyInstance;

  beforeEach(() => {
    catalogApi = {
      getLocations: jest.fn().mockResolvedValue({ items: locations }),
      removeLocationById: jest.fn().mockResolvedValue(undefined),
    };
    alertApi = { post: jest.fn(), alert$: jest.fn() };
  });

  const render = (result: AuthorizeResult.ALLOW | AuthorizeResult.DENY = AuthorizeResult.ALLOW) => {
    const permissionApi = mockApis.permission({ authorize: result });
    authorize = jest.spyOn(permissionApi, 'authorize');
    // usePermission caches decisions in a global SWR cache, which would leak between tests
    return renderInTestApp(
      <SWRConfig value={{ provider: () => new Map() }}>
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [alertApiRef, alertApi],
          [permissionApiRef, permissionApi],
        ]}
      >
        <CatalogCleanupPage />
      </TestApiProvider>
      </SWRConfig>,
    );
  };

  // The button starts disabled while the permission decision is loading
  const findEnabledDeleteButton = async (target: string) => {
    const button = await screen.findByRole('button', { name: `Delete location ${target}` });
    await waitFor(() => expect(button).toBeEnabled());
    return button;
  };

  it('lists the catalog locations', async () => {
    await render();

    expect(await screen.findByText(locations[0].target)).toBeInTheDocument();
    expect(screen.getByText(locations[1].target)).toBeInTheDocument();
  });

  it('deletes a location after confirmation and reloads the list', async () => {
    await render();
    await userEvent.click(await findEnabledDeleteButton(locations[0].target));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(catalogApi.removeLocationById).toHaveBeenCalledWith('loc-1'));
    await waitFor(() => expect(catalogApi.getLocations).toHaveBeenCalledTimes(2));
    expect(alertApi.post).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the dialog open and shows the error when deletion fails', async () => {
    catalogApi.removeLocationById.mockRejectedValue(new Error('Forbidden by policy'));
    await render();
    await userEvent.click(await findEnabledDeleteButton(locations[0].target));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByText(/Forbidden by policy/)).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(alertApi.post).not.toHaveBeenCalled();
    expect(catalogApi.getLocations).toHaveBeenCalledTimes(1);
  });

  it('does not delete when the dialog is cancelled', async () => {
    await render();
    await userEvent.click(await findEnabledDeleteButton(locations[0].target));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(catalogApi.removeLocationById).not.toHaveBeenCalled();
  });

  it('disables deletion without the catalog.location.delete permission', async () => {
    await render(AuthorizeResult.DENY);

    const button = await screen.findByRole('button', { name: `Delete location ${locations[0].target}` });
    await waitFor(() => expect(authorize).toHaveBeenCalled());
    await authorize.mock.results[0].value;
    await waitFor(() => expect(button).toBeDisabled());
    expect(authorize).toHaveBeenCalledWith(
      expect.objectContaining({ permission: expect.objectContaining({ name: 'catalog.location.delete' }) }),
    );
  });

  it('shows an error panel when locations cannot be loaded', async () => {
    catalogApi.getLocations.mockRejectedValue(new Error('catalog is down'));
    await render();

    // The error panel repeats the message in its summary and details
    expect((await screen.findAllByText(/catalog is down/)).length).toBeGreaterThan(0);
  });
});

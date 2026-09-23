import { useState } from 'react';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogLocationDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import { usePermission } from '@backstage/plugin-permission-react';
import type { Location } from '@backstage/catalog-client';

export const CatalogCleanupPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const { allowed: canDelete } = usePermission({
    permission: catalogLocationDeletePermission,
  });
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  const {
    value: locations,
    loading,
    error,
    retry,
  } = useAsyncRetry(async () => (await catalogApi.getLocations()).items, [catalogApi]);

  const handleDeleteConfirm = async () => {
    if (!locationToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await catalogApi.removeLocationById(locationToDelete.id);
      alertApi.post({
        // The target is usually a long URL that overflows the snackbar
        message: 'Location deleted',
        severity: 'success',
        display: 'transient',
      });
      setLocationToDelete(null);
      retry();
    } catch (err) {
      // Keep the dialog open so the user sees why it failed
      setDeleteError(err as Error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setLocationToDelete(null);
    setDeleteError(null);
  };

  const columns: TableColumn<Location>[] = [
    {
      title: 'ID',
      field: 'id',
      width: '30%',
    },
    {
      title: 'Type',
      field: 'type',
      width: '15%',
    },
    {
      title: 'Target',
      field: 'target',
      width: '45%',
    },
    {
      title: 'Actions',
      width: '10%',
      render: (row: Location) => (
        <Tooltip title={canDelete ? 'Delete location' : 'You are not allowed to delete locations'}>
          <span>
            <IconButton
              size="small"
              color="secondary"
              aria-label={`Delete location ${row.target}`}
              disabled={!canDelete}
              onClick={() => {
                setDeleteError(null);
                setLocationToDelete(row);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
  ];

  if (loading && !locations) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Catalog Locations</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={retry}
        >
          Refresh
        </Button>
      </Box>

      <Typography variant="body1" color="textSecondary" paragraph>
        Manage catalog locations. This helps you find and remove orphaned locations that
        may not appear in the UI but still exist in the system.
      </Typography>

      <Table
        title="Locations"
        options={{ paging: true, pageSize: 20, search: true }}
        columns={columns}
        data={locations ?? []}
      />

      <Dialog open={locationToDelete !== null} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this location? Entities that only came
            from it will be orphaned.
            <br />
            <br />
            <strong>ID:</strong> {locationToDelete?.id}
            <br />
            <strong>Type:</strong> {locationToDelete?.type}
            <br />
            <strong>Target:</strong> {locationToDelete?.target}
          </DialogContentText>
          {deleteError && (
            <Alert severity="error">
              Failed to delete location: {deleteError.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="secondary"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

import React, { useState } from 'react';
import { useAsync } from 'react-use';
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
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useApi, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { CatalogClient, Location } from '../api';

export const CatalogCleanupPage = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const catalogClient = new CatalogClient({ discoveryApi, fetchApi });

  const { value: locations, loading, error } = useAsync(async () => {
    return catalogClient.getLocations();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteClick = (location: Location) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!locationToDelete) return;

    setIsDeleting(true);
    try {
      await catalogClient.deleteLocation(locationToDelete.id);
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
      handleRefresh();
    } catch (err) {
      console.error('Failed to delete location:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
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
        <Tooltip title="Delete location">
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleDeleteClick(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
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
          onClick={handleRefresh}
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
        data={locations || []}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this location?
            <br />
            <br />
            <strong>ID:</strong> {locationToDelete?.id}
            <br />
            <strong>Type:</strong> {locationToDelete?.type}
            <br />
            <strong>Target:</strong> {locationToDelete?.target}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="secondary"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

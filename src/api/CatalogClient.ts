import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export interface Location {
  id: string;
  type: string;
  target: string;
}

export interface LocationWrapper {
  data: Location;
}

export class CatalogClient {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getLocations(): Promise<Location[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('catalog');
    const response = await this.fetchApi.fetch(`${baseUrl}/locations`);

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data = (await response.json()) as LocationWrapper[];
    return data.map(wrapper => wrapper.data);
  }

  async deleteLocation(id: string): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('catalog');
    const response = await this.fetchApi.fetch(`${baseUrl}/locations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete location: ${response.statusText}`);
    }
  }
}

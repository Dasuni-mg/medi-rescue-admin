import { Service } from './service';

class TenantService extends Service {
  constructor() {
    super('tenant');
  }

  async createTenant(data) {
    try {
      const response = await this.api.post('', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async searchTenant(offset, limit, name, sort) {
    try {
      const params = new URLSearchParams();

      params.append('name', name);
      params.append('offset', offset);
      params.append('limit', limit);
      params.append('sort', sort);

      const response = await this.api.get('', {
        params: params
      });

      const totalRowCount = response.headers.get('X-Total-Count');
      return { data: response.data, totalRowCount: parseInt(totalRowCount, 10) };
    } catch (error) {
      throw error.response.data;
    }
  }

  async updateTenant({ id, data }) {
    try {
      const response = await this.api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async viewTenant(id) {
    const params = new URLSearchParams();

    try {
      const response = await this.api.get(`/${id}`, {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async deleteTenant(id) {
    const params = new URLSearchParams();
    try {
      const response = await this.api.delete(`/${id}`, {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export const tenantService = new TenantService();

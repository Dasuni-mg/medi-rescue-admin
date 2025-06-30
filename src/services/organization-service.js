import { Service } from './service';

class OrganizationService extends Service {
  constructor() {
    super('organization');
  }

  async createOrganization(data) {
    try {
      const response = await this.api.post('', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async searchOrganization(name, page, size, sorts, tenantId) {
    try {
      const params = new URLSearchParams();
      if (tenantId) {
        params.append('tenantId', tenantId);
      }
      params.append('name', name);
      params.append('page', page);
      params.append('size', size);
      for (const sort of sorts) {
        params.append('sort', sort);
      }

      const response = await this.api.get('', {
        params: params
      });

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async updateOrganization({ id, data }) {
    try {
      const response = await this.api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async viewOrganization(id, tenantId) {
    const params = new URLSearchParams();
    if (tenantId) {
      params.append('tenantId', tenantId);
    }
    try {
      const response = await this.api.get(`/${id}`, {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async deleteOrganization(id, tenantId) {
    const params = new URLSearchParams();
    if (tenantId) {
      params.append('tenantId', tenantId);
    }
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

export const organizationService = new OrganizationService();

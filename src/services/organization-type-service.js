import { Service } from './service';

class OrganizationTypeService extends Service {
  constructor() {
    super('organizationType');
  }

  async listOrganizationType(tenantId) {
    const params = new URLSearchParams();
    if (tenantId) {
      params.append('tenantId', tenantId);
    }
    try {
      const response = await this.api.get('', {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async createOrganizationType(data, tenantId) {
    if (tenantId) {
      const tenant = {
        id: tenantId
      };
      data = { ...data, tenant };
    }
    try {
      const response = await this.api.post('', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export const organizationTypeService = new OrganizationTypeService();

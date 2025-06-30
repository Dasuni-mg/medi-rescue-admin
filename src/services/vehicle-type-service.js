import { Service } from './service';

class VehicleTypeService extends Service {
  constructor() {
    super('vehicleType');
  }

  async listVehicleTypes(tenant) {
    try {
      const response = await this.api.get(`/${tenant}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async createVehicleTypes(name, tenantId) {
    try {
      const data = {
        name: name,
        tenantId: tenantId // Use provided tenantId or default
      };

      const response = await this.api.post('', data); // Adjust the endpoint accordingly
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
}

export const vehicleTypeService = new VehicleTypeService();

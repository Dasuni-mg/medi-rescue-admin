import { Service } from './service';

class FuelTypeService extends Service {
  constructor() {
    super('fuelType');
  }

  async listFuelType() {
    try {
      const response = await this.api.get('');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export const fuelTypeService = new FuelTypeService();

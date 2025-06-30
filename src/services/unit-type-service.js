import { Service } from './service';

class UnitTypeService extends Service {
  constructor() {
    super('unitType');
  }

  async listUnitType() {
    try {
      const response = await this.api.get('');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export const unitTypeService = new UnitTypeService();

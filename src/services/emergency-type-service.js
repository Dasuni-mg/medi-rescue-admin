import { Service } from './service';

class EmergencyTypeTypeService extends Service {
  constructor() {
    super('emergencyType');
  }

  async listEmergencyType() {
    try {
      const response = await this.api.get('');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export const emergencyTypeService = new EmergencyTypeTypeService();

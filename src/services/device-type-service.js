import { Service } from './service';

class DeviceTypeService extends Service {
  constructor() {
    super('deviceType'); // Assuming 'deviceType' is the resource
  }

  async getDeviceTypes() {
    try {
      const response = await this.api.get('');
      // Filter out deleted device types
      return response.data?.filter((deviceType) => !deviceType.isDeleted) || [];
    } catch (error) {
      console.error('Error fetching device types:', error);
      this.handleError(error);
      return [];
    }
  }

  handleError(error) {
    console.error('API Error:', error); // Log the error for debugging
    return Promise.reject(new Error(error));
  }
}

export const deviceTypeService = new DeviceTypeService();

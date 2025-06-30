import { Service } from './service';

class FileUploadService extends Service {
  constructor() {
    super('fileUpload', 'Basic');
  }
  fileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file[0].file);
      formData.append('usage', 'profImg');
      formData.append('refNo', '123');

      const response = await this.api.post('', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export const fileUploadService = new FileUploadService();

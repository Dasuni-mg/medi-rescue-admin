import axios from 'axios';
import { storageService } from 'services/storage-service';

export class Service {
  constructor(resource, authType) {
    this.baseURL = process.env.NEXT_PUBLIC_AG_SERV;
    this.resource = resource;
    this.authType = authType; // 'Bearer' or 'Basic'
    this.api = axios.create({
      baseURL: this.baseURL?.concat(`/${this.resource}`),
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
      timeout: 100000
    });

    this.intercept();
  }

  intercept() {
    // Add a request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (this.authType === 'Basic') {
          // Basic Authorization
          const basicAuth = 'YXBpOkAoc1c1cUU9';
          config.headers.Authorization = 'Basic ' + basicAuth;
        } else {
          // Bearer Authorization
          config.headers.Authorization = 'Bearer ' + storageService.getToken();
        }
        // Set X-Tenant-Id for both fileUpload and other resources
        config.headers['X-Tenant-Id'] = ''; // Add the tenant ID here
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    this.api.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );
  }
}

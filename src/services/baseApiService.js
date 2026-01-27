import apiClient from '../network/apiClient';
import ShowNotifications from '../utils/notification';

export class BaseApiService {
  constructor() {
    this.apiClient = apiClient;
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.apiClient.get(endpoint, { params });
      console.log(response, "rrrrrrrrrr");

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(endpoint, data) {
    try {
      const response = await this.apiClient.post(endpoint, data);
      console.log(response, "responce");

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put(endpoint, data) {
    try {
      const response = await this.apiClient.put(endpoint, data);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.apiClient.delete(endpoint);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // handleResponse(response) {
  //   if (response.status >= 200 && response.status < 300) {
  //     return {
  //       success: true,
  //       data: response.data,
  //       message: response.data?.message || 'Success'
  //     };
  //   }
  //   return this.handleError({
  //     response: {
  //       status: response.status,
  //       data: response.data
  //     }
  //   });
  // }

  // handleError(error) {
  //   return {
  //     success: false,
  //     error: error,
  //     message: error?.response?.data?.message || error?.message || 'Something went wrong'
  //   };
  // }

  handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      // Show success notification
      ShowNotifications.showAlertNotification(
        response.data?.message || 'Operation successful',
        true
      );
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Success'
      };
    }
    return this.handleError({
      response: {
        status: response.status,
        data: response.data
      }
    });
  }

  handleError(error) {
    let errorMessage = 'Something went wrong';

    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Show error notification
    ShowNotifications.showAlertNotification(errorMessage, false);

    return {
      success: false,
      error: error,
      message: errorMessage
    };
  }
}

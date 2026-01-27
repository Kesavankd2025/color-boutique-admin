import apiClient from '../network/apiClient';
// import ShowNotifications from '../utils/notification'; // Uncomment if you want to use notifications

class PettyCashApi {
  // Create petty cash entry
  async createPettyCash(input) {
    try {
      const response = await apiClient.post('/pettyCash', input);

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }

    } catch (error) {
      console.error("API Error:", error);

      // Axios error will usually have .response
      if (error.response) {
        return { status: false, response: error.response.data };
      } else if (error.request) {
        // Request made but no response (network error / CORS / server down)
        return { status: false, response: { message: "No response from server" } };
      } else {
        // Something else in config/axios itself
        return { status: false, response: { message: error.message || "Unexpected error" } };
      }
    }
  }

  async createPettyCashManagement(input) {
    try {
      const response = await apiClient.post('/pettyCashManagement', input);
      if (response.status === 200 || response.status === 201) {
        // ShowNotifications.showAlertNotification(response.data.message, true);
        return { status: true, response: response.data };
      } else {
        // ShowNotifications.showAlertNotification('Something went wrong', true);
        return { status: false, response: response.data };
      }
    } catch (error) {
      // ShowNotifications.showAxiosErrorAlert(error);
      return { status: false, response: error.response?.data || null };
    }
  }
  // Get list of petty cash entries
  async getPettyCashList(params) {
    try {
      const response = await apiClient.get('/pettyCash', { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }
  async getAllPettyCashManagementList(params) {
    try {
      const response = await apiClient.get('/pettyCashManagement', { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }
  // Get a single petty cash entry by ID
  async getPettyCashById(id) {
    try {
      const response = await apiClient.get(`/pettyCash/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  // Update a petty cash entry by ID
  async updatePettyCash(id, input) {
    try {
      const response = await apiClient.patch(`/pettyCash/${id}`, input);
      if (response.status === 200 || response.status === 201) {
        // ShowNotifications.showAlertNotification(response.data.message, true);
        return { status: true, response: response.data };
      } else {
        // ShowNotifications.showAlertNotification('Something went wrong', true);
        return { status: false, response: response.data };
      }
    } catch (error) {
      // ShowNotifications.showAxiosErrorAlert(error);
      return { status: false, response: error.response?.data || null };
    }
  }

  async updatePettyCashManagement(id, input) {
    try {
      const response = await apiClient.put(`/pettyCashManagement/${id}`, input);
      if (response.status === 200 || response.status === 201) {
        // ShowNotifications.showAlertNotification(response.data.message, true);
        return { status: true, response: response.data };
      } else {
        // ShowNotifications.showAlertNotification('Something went wrong', true);
        return { status: false, response: response.data };
      }
    } catch (error) {
      // ShowNotifications.showAxiosErrorAlert(error);
      return { status: false, response: error };
    }
  }

  // Get petty cash summary report
  async getSummary(params) {
    try {
      const response = await apiClient.get('/pettyCash/summary', { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }
}

const pettyCashApi = new PettyCashApi();
export default pettyCashApi;
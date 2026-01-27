// apiProvider/boxCashapi.ts
import apiClient from '../network/apiClient';

class BoxCashApi {
  async createBoxCash(input) {
    try {
      const response = await apiClient.post('/boxCash', input, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        return { status: false, response: error.response.data };
      } else if (error.request) {
        return { status: false, response: { message: "No response from server" } };
      } else {
        return { status: false, response: { message: error.message || "Unexpected error" } };
      }
    }
  }

  async getBoxCashList(params) {
    try {
      const response = await apiClient.get('/boxCash', { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async getBoxCashById(id) {
    try {
      const response = await apiClient.get(`/boxCash/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async updateBoxCash(id, input) {
    try {
      const response = await apiClient.put(`/boxCash/${id}`, input);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async updatePettyCashManagementForAdmin(id, input) {
    try {
      const response = await apiClient.put(`/pettyCashManagement-for-admin/${id}`, input);
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

  async deleteBoxCash(id) {
    try {
      const response = await apiClient.delete(`/boxCash/${id}`);
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

const boxCashApi = new BoxCashApi();
export default boxCashApi;
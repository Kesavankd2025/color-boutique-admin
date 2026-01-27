import apiClient from '../network/apiClient';

class BoxCashManagementApi {
  async createBoxCashManagement(input) {
    try {
      const response = await apiClient.post('/box-cash-management', input, {
        headers: {
          'Content-Type': 'application/json',
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

  async getBoxCashManagementList(params = {}) {
    try {
      const response = await apiClient.get('/box-cash-management', { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async getBoxCashManagementById(id) {
    try {
      const response = await apiClient.get(`/box-cash-management/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async getBoxCashManagementByDate(date) {
    try {
      const response = await apiClient.get(`/box-cash-management/date/${date}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async updateBoxCashManagement(id, input) {
    try {
      const response = await apiClient.put(`/box-cash-management/${id}`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async deleteBoxCashManagement(id) {
    try {
      const response = await apiClient.delete(`/box-cash-management/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  // Additional helper methods for specific use cases
  async getTodayBoxCashManagement() {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.getBoxCashManagementByDate(today);
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async createClosingAmount(data) {
    try {
      // This is specifically for creating closing amount with denominations
      const response = await apiClient.post('/box-cash-management', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Closing Amount API Error:", error);
      if (error.response) {
        return { status: false, response: error.response.data };
      } else if (error.request) {
        return { status: false, response: { message: "No response from server" } };
      } else {
        return { status: false, response: { message: error.message || "Unexpected error" } };
      }
    }
  }

  // Get summary data for dashboard
  async getBoxCashSummary(params = {}) {
    try {
      const response = await apiClient.get('/box-cash-management', { 
        params: { ...params, limit: 7 } // Default to last 7 days for summary
      });
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

const boxCashManagementApi = new BoxCashManagementApi();
export default boxCashManagementApi;
import apiClient from '../network/apiClient';

class SalesApi {
  async createSalesTarget(input) {
    try {
      const response = await apiClient.post('/sales-targets', input);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }

  async getSalesPerformance() {
    try {
      const response = await apiClient.get('/sales-target/performance');
      if (response.status === 200) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }
  async getSalesIncentiveReport() {
    try {
      const response = await apiClient.get('/sales-target/achieved');
      if (response.status === 200) {
        return { status: true, response: response.data };
      } else {
        return { status: false, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error.response?.data || null };
    }
  }
  async getSalesclientData(input = {}) {
    console.log(input, "input")
    try {
      const params = {
        page: input.page || 0,
        limit: input.limit || 10,
      };

      // Handle search filters
      if (input?.filters && typeof input.filters === 'object') {
        // Search across all searchable columns
        if (input.filters.search && typeof input.filters.search === 'string') {
          params.search = input.filters.search.trim();
        }

        // Individual column filters
        if (input.filters.clientName) {
          params.search = input.filters.clientName.trim();
        }
         if (input.filters.clientMobileNumber) {
          params.search = input.filters.clientMobileNumber.trim();
        }
        if (input.filters.clientType) {
          params.search = input.filters.clientType.trim();
        }
        if (input.filters.salesmanName) {
          params.search = input.filters.salesmanName.trim();
        }
      }

      const response = await apiClient.get('/sales-target/newAddedWholesalerRetailer', {
        params
      });

      if (response.status === 200) {
        return {
          status: true,
          response: {
            data: response.data.data || [],
            total: response.data.total || 0,
            totalPages: Math.ceil((response.data.total || 0) / (input.limit || 10))
          }
        };
      } else {
        console.error("Failed to fetch client data:", response.data?.message);
        return {
          status: false,
          response: response.data
        };
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      return {
        status: false,
        response: error.response?.data || null,
        error: error.message
      };
    }
  }
}

const salesApi = new SalesApi();
export default salesApi; 
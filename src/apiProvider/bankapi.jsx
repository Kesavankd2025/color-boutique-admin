import apiClient from "../network/apiClient";

class BankApi {
  async createBank(input) {
    const response = await apiClient.post("/bank", input);
    return response.data;
  }

  async getBanks(input) {
    console.log("Input for getBanks:", input);
    try {
      const params = {
        page: input.page || 0,
        limit: input.limit || 100,
        search: input.search || ""
      };
      const response = await apiClient.get(`/bank`, { params });

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error("Failed to fetch banks:", response.data?.message ?? "Something went wrong");
        return { status: false, response: response.data };
      }
    } catch (error) {
      console.error("Error fetching banks:", error);

      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - check your token.");
        console.error("Error Response:", error.response.data);
      }

      return { status: false, response: error.response?.data ?? null };
    }
  }

  async getBankDetails(id) {
    const response = await apiClient.get(`/bank/${id}`);
    return response.data;
  }

  async updateBank(id, input) {
    console.log("Updating bank with ID:", id, "Input:", input);
    const response = await apiClient.put(`/bank/${id}`, input);
    return response.data;
  }

  async deleteBank(id) {
    const response = await apiClient.delete(`/bank/${id}`);
    return response.data;
  }
}

const bankApis = new BankApi();
export default bankApis;
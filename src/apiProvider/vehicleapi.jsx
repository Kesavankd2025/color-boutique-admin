import apiClient from "../network/apiClient";

class VehicleApi {
  async createVehicle(input) {
    const response = await apiClient.post("/vehicle", input);
    return response.data;
  }
  async getVehicles(input) {
        console.log("Input for getVehicles:", input);
        try {
            const params = {
                page: input.page || 0, 
                limit: input.limit || 100,
                search:input.search||""
            };
            const response = await apiClient.get(`/vehicle`, { params });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch users:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching users:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

  async getVehicleDetails(id) {
    const response = await apiClient.get(`/vehicle/${id}`);
    return response.data;
  }

  async updateVehicle(id, input) {
    console.log("Updating vehicle with ID1:", id, "Input1:", input);
    const response = await apiClient.put(`/vehicle/${id}`, input);
    return response.data;
  }

  async deleteVehicle(id) {
    const response = await apiClient.delete(`/vehicle/${id}`);
    return response.data;
  }
}

const vehicleApis = new VehicleApi();
export default vehicleApis;

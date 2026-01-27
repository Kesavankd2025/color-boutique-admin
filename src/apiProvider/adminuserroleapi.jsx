import apiClient from "../network/apiClient";

class ApiProvider {

    async getUserRoleList() {
        try {
            const response = await apiClient.get(`/user-role`);

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
    
    async createRole(input) {
        try {
            // const response = await apiClient.post("/create-user", input);
            const response = await apiClient.post("/user-role", input);
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201) {
                return { status: response.status, response: response };
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

 async updateRole(id, input) {
        try {
            const response = await apiClient.put(`/user-role/${id}`, input);
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201) {
                return { status: response.status, response: response };
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    
     async deleteRole(id, updatedRole) {
            try {
                const response = await apiClient.put(`/user-role/${id}`, updatedRole);
                return { status: response.status, response: response };
            } catch (error) {
                console.error("Delete failed:", error);
                return null;
            }
        }



}
const rolesApiProvider = new ApiProvider()
export default rolesApiProvider
import apiClient from "../network/apiClient";

class ApiProvider {


    async getUserList() {
        try {
            const response = await apiClient.get(`users/get-users`);

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

    async createUser(input) {
        try {
            // const response = await apiClient.post("/create-user", input);
            const response = await apiClient.post("/create-user", input);
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

    async updateUser(id, input) {
        try {
            const response = await apiClient.put(`/users/${id}`, input);
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

    async deleteUser(input) {
        try {
            const response = await apiClient.patch(`/user/${input}`);
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201) {
                // notification.showAlertNotification(response.data.message, true);
                return { status: response.status, response: response };
            } else {
                // notification.showAlertNotification(message, false);/
                return null;
            }
        } catch (error) {
            // notification.showAxiosErrorAlert(error);
            return null;
        }
    }
    async getCustomerList(input) {
        try {
            // Prepare query parameters
            const params = {
                page: input.page || 0,
                limit: input.limit || 100,
            };

            if (input.search) {
                params.search = input.search;
            }

            const response = await apiClient.get(`/customers`, { params });

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

    async getAllCustomerList(input) {

        try {

            const response = await apiClient.get(`/customers`);

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
    async getUserReportDeactiveList(input) {
        console.log("Input for getCustomerList:", input);
        console.log("Filters in getCustomerList:", input?.filters?.phone, input?.filters?.email, input?.filters?.name);
        try {
            const params = {
                page: input.page || 0,
                limit: input.limit || 100,
            };

            // Add search filters if they exist
            if (input?.filters) {
                if (input.filters.email) params.search = input.filters.email;
                if (input.filters.phone) params.search = input.filters.phone;
                if (input.filters.name) params.search = input.filters.name;
            }

            // Add sorting if specified
            // if (input.sortBy) {
            //     params.sortBy = input.sortBy;
            //     params.sortOrder = input.sortOrder || 'asc'; // Default to ascending if not specified
            // }

            const response = await apiClient.get(`/users/inactive`, { params });

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

}
const apiProvider = new ApiProvider()
export default apiProvider
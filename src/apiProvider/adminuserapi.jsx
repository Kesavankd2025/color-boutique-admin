import { toast } from "react-toastify";
import apiClient from "../network/apiClient";
import ShowNotifications from "../utils/notification";

class ApiProvider {

    async getUserList(input) {
        try {
            const response = await apiClient.get(`/users`, {
                params: input ? input : {}
            });

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

    async serchLimanCrmUsers(input) {
        try {
            const response = await apiClient.get(`/linemanCrmUsers`, {
                params: input ? input : {}
            });

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
            const response = await apiClient.post("/users", input);
            console.log(response, "response")
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201) {
                return { status: true, response: response };
            } else {
                const msg = response.data?.errorDetails || response.data?.message || "Something went wrong";
                ShowNotifications.showAlertNotification(msg, true);
                return { status: false };
            }
        } catch (error) {

            const msg = error?.data?.errorDetails || error.response?.data?.message || error.message;
            ShowNotifications.showAlertNotification(msg, false)
            return { response: null, status: false };
        }
    }

    // async updateUser(id, input) {
    //     try {
    //         const response = await apiClient.post(`/users/${id}?_method=PUT`, input, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         return { status: response.status, response };
    //     } catch (error) {
    //         console.error("Update user error:", error?.response?.data || error.message);
    //         return null;
    //     }
    // }


    async updateUser(id, input) {
        try {
            const response = await apiClient.put(`/users/${id}`, input);
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201) {
                return { status: response.status, response: response };
            } else {
                const msg = response.data?.errorDetails || response.data?.message || "Something went wrong";
                ShowNotifications.showAlertNotification(msg, true);
                return { status: false };
            }
        } catch (error) {

            const msg = error?.data?.errorDetails || error.response?.data?.message || error.message;
            ShowNotifications.showAlertNotification(msg, false)
            return { response: null, status: false };
        }
    }

    async deleteUser(id, updatedUser) {
        try {
            const response = await apiClient.put(`/users/${id}`, updatedUser);
            return { status: response.status, response: response };
        } catch (error) {
            console.error("Delete failed:", error);
            return null;
        }
    }
    async Userbyid(id) {
        try {
            const response = await apiClient.get(`/admin-user/${id}`);
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
    async getCashSettlement(input) {
        try {
            const response = await apiClient.get(`/cashsettlement-list`, {
                params: input ? input : {}
            });

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
    async updateCashSettlement(input) {
        try {
            const response = await apiClient.patch(`/cashsettlement-status/${input.id}`,
                {
                    status: input.status
                }
            );

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

    async getUserListForList(input) {
        try {
            const response = await apiClient.get("/users/all", {
                params: input ? input : {}
            });

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
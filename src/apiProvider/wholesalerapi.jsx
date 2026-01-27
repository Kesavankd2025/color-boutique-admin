import { type } from "jquery";
import apiClient from "../network/apiClient";

class ApiProvider {


    async createWholesaler(input) {
        console.log(input, "input");

        try {
            console.log("enetr 1");

            const response = await apiClient.post('/wholesaler', input)
            console.log(response, "response");
            console.log("enetr 2");


            if (response.status == 200 || response.status == 201) {
                console.log("enetr 3");

                //   ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    response: response.data,
                    status: true
                }
            } else {
                console.log("enetr 4");

                //  ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    response: response,
                    status: false
                }
            }
        } catch (err) {
            console.log("enetr 5", err);

            //   ShowNotifications.showAxiosErrorAlert(err)
            return {
                response: err,
                status: false
            }
        }
    }
    async getTopWholesaler(input) {
        const params = {
            page: input.page || 0,
            limit: input.limit || 10,
            type: input.type || "wholesaler",
            placedByModel: input.placedByModel || "Wholesaler",
        };

        console.log(input, 'input')
        try {
            const response = await apiClient.get(`/top-wholesaler-orders`, {
                params
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch top wholesaler list:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching top wholesaler list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

     async getWholesalerList(input) {
        const params = {
            page: input.page || 0,  // Changed default to 1 as most APIs expect page numbering to start at 1
            limit: input.limit || 100,
            search: input.search || "",
            type: input.type || "Wholesaler",
            from: "admin",
            order: "desc"

        };
        console.log(input, 'input')
        try {
            const response = await apiClient.get(`/wholesaler/list-dtls`, {
                params
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch wholesaler list:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching wholesaler list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getWholesalerListAll(input) {
        const params = {
            page: input.page || 0,  // Changed default to 1 as most APIs expect page numbering to start at 1
            limit: input.limit || 100,
            search: input.search || "",
            type: input.type || "Wholesaler",
            from: "admin",
            order: "desc"

        };
        console.log(input, 'input')
        try {
            const response = await apiClient.get(`/wholesaler/with-inactive-list-dtls`, {
                params
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch wholesaler list:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching wholesaler list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async updateWholesaler(id, input) {
        try {
            const response = await apiClient.put(`/wholesaler/${id}`, input);
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
    async updateStatus(input) {
        try {
            const response = await apiClient.put(`/wholesaler/update/status`, input);
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

    async sendOtp(data) {
        try {
            const response = await apiClient.post('/wholesaler/send-otp', data);

            if (response.status === 200 || response.status === 201) {
                return {
                    status: true,
                    message: response.data?.message || 'OTP sent successfully'
                };
            } else {
                return {
                    status: false,
                    message: response.data?.message || 'Failed to send OTP'
                };
            }
        } catch (error) {
            console.error("OTP send error:", error);
            return {
                status: false,
                message: error.response?.data?.message || error.message || 'Failed to send OTP'
            };
        }
    }

    async verifyOtp(data) {
        try {
            const response = await apiClient.post('/wholesaler/otp-verification', data);

            if (response.status === 200 || response.status === 201) {
                return {
                    status: true,
                    message: response.data?.message || 'OTP verified successfully'
                };
            } else {
                return {
                    status: false,
                    message: response.data?.message || 'OTP verification failed'
                };
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            return {
                status: false,
                message: error.response?.data?.message || error.message || 'OTP verification failed'
            };
        }
    }

    async getWholesalerOrders() {
        try {
            const response = await apiClient.get(`/wholesaler/order/paymentstatus`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch wholesaler list:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching wholesaler list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getWholesalerCredit(input) {
        try {
            const response = await apiClient.get(`/wholesaler/order/credit-dtls`, {
                params: input
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch wholesaler list:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching wholesaler list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }


    async getCreditHistroy(input) {
        try {
            const response = await apiClient.get(`/wholesaler/order/credit`, {
                params: input
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch wholesaler list:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching wholesaler list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async increaseCreditLimit(input) {
        try {
            const response = await apiClient.patch(`/wholesaler/update/credit`, input);
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

    async getUserVareientList() {
        try {
            const response = await apiClient.get(`/root/customer-variant/list`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch wholesaler list:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching wholesaler list:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }


    async updateWholesalerVariant(input) {
        try {
            const response = await apiClient.patch(`/root/customer-variant/retailer`, input);
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
    async exportWholesalersExcel(params) {
        try {
            const response = await apiClient.get('/wholesaler/export-excel', {
                params
            });

            if (response.status === 200 || response.status === 201) {
                return {
                    status: true,
                    response: response.data
                };
            } else {
                console.error("Failed to export wholesalers:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error exporting wholesalers:", error);
            return { status: false, response: error.response?.data ?? null };
        }
    }


}
const apiProvider = new ApiProvider()
export default apiProvider
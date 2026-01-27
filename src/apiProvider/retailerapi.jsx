import apiClient from "../network/apiClient";

class ApiProvider {


    async createRetailer(input) {
        try {
            const response = await apiClient.post('/wholesaler', input)

            if (response.status == 200 || response.status == 201) {
                //   ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    status: true
                }
            } else {
                //  ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false
                }
            }
        } catch (err) {
            //   ShowNotifications.showAxiosErrorAlert(err)
            return {
                response: null,
                status: false
            }
        }
    }


    async getRetailerList(input) {
        try {
            const params = {
                page: input.page || 0,
                limit: input.limit || 10,
            };

            if (input?.filters && typeof input.filters === 'object' && Object.keys(input.filters).length > 0) {
                if (input.filters.name && typeof input.filters.name === 'string') {
                    params.search = input.filters.name.trim();
                } else if (input.filters.phone && typeof input.filters.phone === 'string') {
                    params.search = input.filters.phone.trim();
                }
            }
            const response = await apiClient.get(`/wholesaler/list`, {
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

    async updateRetailer(id, input) {
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
}
const apiProvider = new ApiProvider()
export default apiProvider
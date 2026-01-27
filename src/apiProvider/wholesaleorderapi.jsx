import apiClient from "../network/apiClient";

class ApiProvider {

    async getWholesaleOrder(input) {
        try {
            const params = {
                page: input.page || 0,
                limit: input.limit || 10,
                type: input.type,
                orderType: input.orderType,
                Id: input.Id,
                status: input.status,
            };
            if (input?.filters && typeof input.filters === 'object' && Object.keys(input.filters).length > 0) {
                if (input.filters.name && typeof input.filters.name === 'string') {
                    params.search = input.filters.name.trim();
                } else if (input.filters.paymentMode && typeof input.filters.paymentMode === 'string') {
                    params.search = input.filters.paymentMode.trim();
                } else if (input.filters.delivery && typeof input.filters.delivery === 'string') {
                    params.search = input.filters.delivery.trim();
                } else if (input.filters.status && typeof input.filters.status === 'string') {
                    params.search = input.filters.status.trim();
                } else if (input.filters.total && typeof input.filters.total === 'string') {
                    params.search = input.filters.total.trim();
                }
            }
            const response = await apiClient.get(`/order-list/`, {
                params
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getWholesaleDeliveryOrder(input) {
        try {
            const response = await apiClient.get(`/delivery-list/`, {
                params: {
                    limit: input.limit,
                    page: input.page,
                    type: input.type,
                    orderType: input.orderType,
                    Id: input.Id,

                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

     async getUserActivityLogs(input) {
        try {
            const response = await apiClient.get(`/users-logs`, {
                params: {
                    limit: input.limit,
                    page: input.page,
                    search: input.search || "",
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getUnpaidOrderList(input) {
        try {
            const response = await apiClient.get(`/payment/unpaid-order-list`, {
                params: {
                    limit: input.limit,
                    page: input.page,
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getDailypaymentList(input) {
        try {
            const response = await apiClient.get(`/payment/daily-payment-list`, {
                params: {
                    limit: input.limit,
                    page: input.page,
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

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
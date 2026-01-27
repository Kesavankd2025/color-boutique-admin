import apiClient from "../network/apiClient";
import ShowNotifications from '../utils/notification'

class Rootprovider {

    async addRoot(input) {
        try {
            const response = await apiClient.post("/root", input);
            const message = response.data?.message ?? "Root created successfully";
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(message, true);
                return { status: response.status, response: response };
            } else {
                ShowNotifications.showAlertNotification('Something went wrong', false);
                return { status: response.status, response: response };
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                const errorMessage = data?.message || 'Failed to create root';

                if (status === 409) {
                    ShowNotifications.showAlertNotification('A root with this name already exists', false);
                } else {
                    ShowNotifications.showAlertNotification(errorMessage, false);
                }

                return {
                    status: status,
                    response: error.response,
                    error: errorMessage
                };
            } else {
                // Handle network errors
                const errorMessage = error.message || 'Network error occurred';
                ShowNotifications.showAlertNotification(errorMessage, false);
                return {
                    status: 0,
                    error: errorMessage
                };
            }
        }
    }

    async getRoot(input) {
        try {
            const params = {
                page: input.page || 0,
                limit: input.limit || 10,
            };
            if (input?.filters && typeof input.filters === 'object' && Object.keys(input.filters).length > 0) {
                if (input.filters.rootName && typeof input.filters.rootName === 'string') {
                    params.search = input.filters.rootName.trim();
                } else if (input.filters.pincode && typeof input.filters.pincode === 'string') {
                    params.search = input.filters.pincode.trim();
                } else if (input.filters.salesman && typeof input.filters.salesman === 'string') {
                    params.search = input.filters.salesman.trim();
                } else if (input.filters.deliveryman && typeof input.filters.deliveryman === 'string') {
                    params.search = input.filters.deliveryman.trim();
                } else if (input.filters.deliveryCharge && typeof input.filters.deliveryCharge === 'string') {
                    params.search = input.filters.deliveryCharge.trim();
                }
            }
            const response = await apiClient.get("/root", {
                params
            });
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
    async getRootById(input) {
        try {
            const response = await apiClient.get(`/root/${input}`);
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

    async updateRoot(input) {
        try {
            const response = await apiClient.patch(`/root`, input);
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201) {
                ShowNotifications.showAlertNotification(response.data.message, true)

                // notification.showAlertNotification(response.data.message, true);
                return { status: response.status, response: response };
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)

                // notification.showAlertNotification(message, false);/
                return null;
            }
        } catch (error) {
            // notification.showAxiosErrorAlert(error);
            return null;
        }
    }

    async deleteRoot(input) {
        try {
            const response = await apiClient.patch(`/root/${input}`);
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201) {
                ShowNotifications.showAlertNotification(response.data.message, true)

                // notification.showAlertNotification(response.data.message, true);
                return { status: response.status, response: response };
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)

                // notification.showAlertNotification(message, false);/
                return null;
            }
        } catch (error) {
            // notification.showAxiosErrorAlert(error);
            return null;
        }
    }

}
const rootprovider = new Rootprovider()
export default rootprovider
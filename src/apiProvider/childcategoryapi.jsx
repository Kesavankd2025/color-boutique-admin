import apiClient from "../network/apiClient";
import ShowNotifications from '../utils/notification'

class ChildCategoryProvider {

    async addChildCategory(input) {
        try {
            const response = await apiClient.post("/child-categories", input);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message, true);
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

    async getChildCategorys(input) {
        try {

            const response = await apiClient.get("/child-categories", { params: input });
            if (response.status == 200 || response.status == 201) {
                return { status: response.status, response: response.data };
            } else {
                return null;
            }
        } catch (error) {
            // notification.showAxiosErrorAlert(error);
            return null;
        }
    }
    async getChildCategoryById(input) {
        try {
            const response = await apiClient.get(`/child-categories/${input}`);
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
    async getChildCategoryByIds(input) {
        try {
            const response = await apiClient.get(`/child-categories/subcategory/${input.subcategoryId}`);
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
    async updateChildCategory(id, input) {
        try {
            const response = await apiClient.put(`/child-categories/${id}`, input);
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

    async deleteChildCategory(input) {
        try {
            const response = await apiClient.delete(`/child-categories/${input}`);
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
const childCategory = new ChildCategoryProvider()
export default childCategory
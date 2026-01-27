import apiClient from "../network/apiClient";
import ShowNotifications from '../utils/notification'


class subCategoryProvider {

    async addSubCategory(input) {
        try {
            const response = await apiClient.post("/subcategories", input);
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
                               ShowNotifications.showAlertNotification('A sub category with this name already exists', false);
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

    async getSubCategorys(input) {
        try {
            const params = {
                limit: input.limit,
                offset: input.offset,
                search: input.search || '',
                categoryId: input.categoryId || ''
            }
            const response = await apiClient.get("/subcategories", { params });
            if (response.status == 200 || response.status == 201) {
                return { status: response.status, response: response };
            } else {
                return null;
            }
        } catch (error) {
            // notification.showAxiosErrorAlert(error);
            return null;
        }
    }
    async getSubCategoryById(input) {
        console.log(input,"categoryId")
        try {
            const response = await apiClient.get(`/subcategories/${input}`);
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


    async getSubCategoryByIds(input) {
        console.log(input,"categoryId")
        try {
            const response = await apiClient.get(`/subcategories/category/${input.categoryId}`);
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

    async updateSubCategory(id, input) {
        try {
            const response = await apiClient.put(`/subcategories/${id}`, input);
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

    async deleteSubCategory(input) {
        try {
            const response = await apiClient.delete(`/subcategories/${input}`);
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
const subCategory = new subCategoryProvider()
export default subCategory
import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class bannerApi {
    async createBanner(input) {
        try {
            const response = await apiClient.post('/banner', input)

            if (response.status == 200 || response.status == 201) {
                ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    status: true
                }
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false
                }
            }
        }catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.errorDetails ||
                error?.message ||
                "Something went wrong";

            ShowNotifications.showAlertNotification(message, false);

            return {
                response: null,
                status: false
            }
        }
    }

    async bannerList(input) {
        const params = {
            page: input.page || 0,
            limit: input.limit || 100,
            search: input.search || "",
        };
        try {
            const response = await apiClient.get('/banner', { params })

            if (response.status == 200 || response.status == 201) {
                // ShowNotifications.showAlertNotification("Banner Fetched Successfully", true)
                return {
                    response: response.data,
                    status: true
                }
            } else {
                //ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false
                }
            }
        } catch (error) {
            // ShowNotifications.showAxiosErrorAlert(error)
            return {
                response: null,
                status: false
            }
        }
    }

    async updateBanner(id, input) {
        try {
            const response = await apiClient.patch(`/banner/${id}`, input)
            if (response.status == 200 || response.status == 201) {
                ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    status: true
                }
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false
                }
            }
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.errorDetails ||
                error?.message ||
                "Something went wrong";

            ShowNotifications.showAlertNotification(message, false);

            return {
                response: null,
                status: false
            }
        }
    }
    async deleteBanner(id) {
        try {
            const response = await apiClient.delete(`/banner/${id}`)

            if (response.status == 200 || response.status == 201) {
                // ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    response: response.data,
                    status: true
                }
            } else {
                // ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false
                }
            }
        } catch (error) {
            ShowNotifications.showAxiosErrorAlert(error)
            return {
                response: null,
                status: false
            }
        }
    }
}

const BannerApi = new bannerApi()
export default BannerApi

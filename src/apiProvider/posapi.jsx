import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class posdApi {
    async addCustomer(input) {
        try {
            const response = await apiClient.post('/add-customer', input)

            if (response.status == 200 || response.status == 201) {
                ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    status: true,
                    response: response.data
                }
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false
                }
            }
        } catch (err) {
            ShowNotifications.showAxiosErrorAlert(err)
            return {
                response: null,
                status: false
            }
        }
    }

    async searchCustomers(input) {
        try {
            const response = await apiClient.get('/customer-list', {
                params: {
                    search: input
                }
            })

            if (response.status == 200 || response.status == 201) {
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
    async getCustomerOrders(input) {
        try {
            const response = await apiClient.get('/user/orders', {
                params: {
                    page: input.page,
                    limit: input.limit,
                    type: input.type,
                    userId: input.userId
                }
            })

            if (response.status == 200 || response.status == 201) {
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
    async searchProducts(input) {
        try {
            const response = await apiClient.get('/product/list/dtls', {
                params: {
                    search: input
                }
            })

            if (response.status == 200 || response.status == 201) {
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
    async searchProductsByUserId(input, userId) {
        try {
            const response = await apiClient.get('/product/active/list/dtls', {
                params: {
                    search: input,
                    userId: userId
                }
            })

            if (response.status == 200 || response.status == 201) {
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

    async getPincodeDetails(input) {
        try {
            const response = await apiClient.get('/root', {
                params: {
                    pincode: input
                }
            })

            if (response.status == 200 || response.status == 201) {
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

    async orderPurcahse(input) {
        try {
            const response = await apiClient.post('/create-order', input)

            if (response.status == 200 || response.status == 201) {
                ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    status: true,
                    response: response.data,

                }
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false
                }
            }
        } catch (err) {
            ShowNotifications.showAxiosErrorAlert(err)
            return {
                response: null,
                status: false
            }
        }
    }
    async CrmorderPurcahse(input) {
        try {
            const response = await apiClient.post('/Crm/orders', input)

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
        } catch (err) {
            ShowNotifications.showAxiosErrorAlert(err)
            return {
                response: null,
                status: false
            }
        }
    }
    async getCRMOrders(input) {
        try {
            const response = await apiClient.get('/crm/orders', {
                params: {
                    page: input.page,
                    limit: input.limit,
                    type: input.type,
                    userId: input.userId,
                    search: input.search || '',
                    format: input.format || ''
                }
            })

            if (response.status == 200 || response.status == 201) {
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
    async brandDetails(input) {
        try {
            const response = await apiClient.get(`/brand/${input}`)

            if (response.status == 200 || response.status == 201) {
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
            // ShowNotifications.showAxiosErrorAlert(error)
            return {
                response: null,
                status: false
            }
        }
    }
    async updateBrand(input, id) {
        try {
            const response = await apiClient.patch(`/brand/edit/${id}`, input)
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
            ShowNotifications.showAxiosErrorAlert(error)
            return {
                response: null,
                status: false
            }
        }
    }
    async deleteBrand(id) {
        try {
            const response = await apiClient.patch(`/brand/delete/${id}`)

            if (response.status == 200 || response.status == 201) {
                ShowNotifications.showAlertNotification(response.data.message, true)
                return {
                    response: response.data,
                    status: true
                }
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)
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

    async getDeliveryCharge(input) {
        console.log(input, "i");

        try {
            const response = await apiClient.post('/get-delivery-charge', input)

            if (response.status == 200 || response.status == 201) {
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
    async searchWholesalerRetailer(input, type) {
        try {
            const response = await apiClient.get('/wholesaler/list-dtls', {
                params: {
                    from: "admin",
                    type: type,
                    search: input,
                }
            })

            if (response.status == 200 || response.status == 201) {
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
    async getHoldOrders(input, userId) {
        try {
            const response = await apiClient.get('/hold-orders', {
                params: {
                    ...input,
                }
            })

            if (response.status == 200 || response.status == 201) {
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
    async holdOrderPurcahse(input) {
        try {
            const response = await apiClient.post('/hold-orders', input)
            if (response.status == 200 || response.status == 201 && response.data) {
                return {
                    status: true,
                    response: response.data.data
                }
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false,
                    response: {}
                }
            }
        } catch (err) {
            ShowNotifications.showAxiosErrorAlert(err)
            return {
                response: null,
                status: false
            }
        }
    }
    async deleteHoldOrder(input) {
        try {
            const response = await apiClient.put(`/hold-orders/${input}`)
            if (response.status == 200 || response.status == 201 && response.data) {
                return {
                    status: true,
                    response: response.data.data
                }
            } else {
                ShowNotifications.showAlertNotification('Some thing went wrong', true)
                return {
                    status: false,
                    response: {}
                }
            }
        } catch (err) {
            ShowNotifications.showAxiosErrorAlert(err)
            return {
                response: null,
                status: false
            }
        }
    }
}

const PosdApi = new posdApi()
export default PosdApi

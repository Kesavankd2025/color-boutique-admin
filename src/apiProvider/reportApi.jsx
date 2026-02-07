import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class reportApi {
    async getProductPerformance(input) {
        const params = {
            productId: input.productId || undefined,
        };
        try {
            const response = await apiClient.get('/report/product-performance', { params })

            if (response.status == 200 || response.status == 201) {
                return {
                    response: response.data,
                    status: true
                }
            } else {
                return {
                    status: false
                }
            }
        } catch (error) {
            return {
                response: null,
                status: false
            }
        }
    }
}

const ReportApi = new reportApi()
export default ReportApi

import apiClient from "../network/apiClient";
import ShowNotifications from "../utils/notification";
class ApiProvider {
  async getCustomerOrder() {
    try {
      const response = await apiClient.get(`/wholeSaleOrder/?limit=20&offset=`);

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch categories:",
          response.data?.message ?? "Something went wrong"
        );
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
  async orderDetails(input) {
    try {
      const response = await apiClient.get(`/order/${input}`);

      if (response.status == 200 || response.status == 201) {
        return {
          response: response.data,
          status: true,
        };
      } else {
        // ShowNotifications.showAlertNotification('Some thing went wrong', true)
        return {
          status: false,
        };
      }
    } catch (error) {
      // ShowNotifications.showAxiosErrorAlert(error)
      return {
        response: null,
        status: false,
      };
    }
  }

  async approvedUpdateStatus(id, status, reason = "") {
    try {
      const endpoint = reason
        ? `/order/status/approve/${id}/${status}/${encodeURIComponent(reason)}`
        : `/order/status/approve/${id}/${status}`;

      const response = await apiClient.patch(endpoint);

      if (response.status === 200 || response.status === 201) {
        const msg = response.data?.message || response.data?.data?.message || "Order updated successfully";
        return {
          status: true,
        };
      } else {
        const msg = response.data?.errorDetails || response.data?.message || "Something went wrong";
        ShowNotifications.showAlertNotification(msg, true);
        return { status: false };
      }
    } catch (error) {
      console.log(error, "rrrrrrrr");

      const msg = error?.data?.errorDetails || error.response?.data?.message || error.message;
      ShowNotifications.showAlertNotification(msg, false)
      return { response: null, status: false };
    }
  }
  async updateOrderStatus(id, status, paymentStatus) {
    try {
      const response = await apiClient.patch(`/order/status/${id}/${status}`, {
        paymentStatus,
      });

      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message, true);
        return {
          status: true,
        };
      } else {
        ShowNotifications.showAlertNotification("Something went wrong", true);
        return {
          status: false,
        };
      }
    } catch (error) {
      ShowNotifications.showAxiosErrorAlert(error);
      return {
        response: null,
        status: false,
      };
    }
  }
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
  async updateOrderPayment(id, paymentMode, amountPaid) {
    try {
      const response = await apiClient.patch(`order/payment/${id}`, {
        paymentMode,
        amountPaid,
      });

      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message, true);
        return {
          status: true,
        };
      } else {
        ShowNotifications.showAlertNotification("Something went wrong", true);
        return {
          status: false,
        };
      }
    } catch (error) {
      ShowNotifications.showAxiosErrorAlert(error);
      return {
        response: null,
        status: false,
      };
    }
  }
  async searchOrders(input) {
    try {
      const response = await apiClient.get(`/get-details-by-invoiceId/${input}`);

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
const customerapiProvider = new ApiProvider();
export default customerapiProvider;

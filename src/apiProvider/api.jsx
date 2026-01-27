import { toast } from "react-toastify";
import apiClient from "../network/apiClient";

class ApiProvider {

  async getProducts() {
    try {
      const response = await apiClient.get('/products');

      if (response.status === 200) {
        const products = response.data;
        console.log("Products retrieved:", products);
        return { status: response.status, data: products };
      } else {
        // If the response status is not 200, return an error message
        return { status: response.status, error: 'Failed to fetch products' };
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      if (error.response) {
        return { status: error.response.status, error: error.response.data?.message || 'Server error' };
      } else if (error.request) {
        return { status: 500, error: 'Network error or no response from the server' };
      } else {
        return { status: 500, error: 'An unknown error occurred' };
      }
    }
  }

  async getCategory(input) {
    console.log("category called")
    try {
      const params = {
        limit: input.limit || 10,
        offset: input.offset || 0,
        search: input.search || '',
      }
      const response = await apiClient.get(`/categories`, { params });  // no extra headers

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

  async updateCategory(input) {
    try {
      const response = await apiClient.put(`category/edit`, input);
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

  async addCourse(input) {
    try {
      const response = await apiClient.post("course/add", input);
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

  async updateCourse(input) {
    try {
      const response = await apiClient.put(`course/edit`, input);
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
  async getCourse(input) {
    try {
      const response = await apiClient.get(`course/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }
  async addCurriculam(input) {
    try {
      const response = await apiClient.post("curriculam/add", input);
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
  async updateCurriculam(input) {
    try {
      const response = await apiClient.put(`curriculam/edit`, input);
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

  async getCurriculam(input) {
    try {
      const response = await apiClient.get(`curriculam/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async getReview(input) {
    try {
      const response = await apiClient.get(`review/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async adminLogin(input) {
    try {
      // Send POST request to the login endpoint
      const response = await apiClient.post("/admin-login", input);
      console.log(response,"response")
      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        const token = response.data;  // Extract the token from the response

        if (token) {
          // If token is found, return it as part of the response
          return { status: response.status, data: token };
        } else {
          return { status: response.status, error: "Token not found in the response." };
        }
      } else {
        return { status: response.status, error: "Login failed. Please check credentials." };
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message)
      return { status: 500, error: "An error occurred while processing your request." };
    }
  }


  // async adminLogin(input) {
  //   try {
  //     const response = await apiClient.post("/auth/login", input);
  //     // const response = await apiClient.post("users/admin-login", input);
  //     const message = response.data?.message ?? "Something went wrong";
  //     if (response.status == 200 || response.status == 201) {
  //       // notification.showAlertNotification(response.data.message, true);
  //       return { status: response.status, response: response };
  //     } else {
  //       // notification.showAlertNotification(message, false);/
  //       return null;
  //     }
  //   } catch (error) {
  //     // notification.showAxiosErrorAlert(error);
  //     return null;
  //   }
  // }


  async getUsers(input) {
    try {
      const response = await apiClient.get(`users/get-users`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }


  async reviewUpdate(input) {
    try {
      const response = await apiClient.put(`review/edit`, input);
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

  async gerContactUs(input) {
    try {
      const response = await apiClient.get(`contact-us/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async addFacilitors(input) {
    try {
      const response = await apiClient.post("about-us/add-facilitors", input);
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

  async getFacilitors(input) {
    try {
      const response = await apiClient.get("about-us/get-facilitors", input);
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


  async updateFacilitator(input) {
    try {
      const response = await apiClient.put(`about-us/edit-facilitor`, input);
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

  async updateUserstatus(input) {
    try {
      const response = await apiClient.put(`users/update-status`, input);
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

  async deletCategory(id) {
    try {
      const response = await apiClient.delete(`category/delete/${id}`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201 && response) {
        // notification.showAlertNotification(response.data.message, true);
        return {
          status: response.status,
          response: response.data
        };
      } else {
        // notification.showAlertNotification(message, false);
        return {
          status: false,
          response: []
        };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: []
      };
    }
  }

  async deletCourse(id) {
    try {
      const response = await apiClient.delete(`course/delete/${id}`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201 && response) {
        // notification.showAlertNotification(response.data.message, true);
        return {
          status: response.status,
          response: response.data
        };
      } else {
        // notification.showAlertNotification(message, false);
        return {
          status: false,
          response: []
        };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: []
      };
    }
  }

  async deletFacilitator(id) {
    try {
      const response = await apiClient.delete(`about-us/delete/${id}`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201 && response) {
        // notification.showAlertNotification(response.data.message, true);
        return {
          status: response.status,
          response: response.data
        };
      } else {
        // notification.showAlertNotification(message, false);
        return {
          status: false,
          response: []
        };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: []
      };
    }
  }


  async addManagementTeam(input) {
    try {
      const response = await apiClient.post("about-us/management-team-add", input);
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

  async getManagementTeam(input) {
    try {
      const response = await apiClient.get("about-us/management-team-get", input);
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


  async updateManagementTeam(input) {
    try {
      const response = await apiClient.put(`about-us/management-team-edit`, input);
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

  async deletManagementTeam(id) {
    try {
      const response = await apiClient.delete(`about-us/management-team/delete/${id}`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201 && response) {
        // notification.showAlertNotification(response.data.message, true);
        return {
          status: response.status,
          response: response.data
        };
      } else {
        // notification.showAlertNotification(message, false);
        return {
          status: false,
          response: []
        };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: []
      };
    }
  }
  async getWholesalerPaymentdues(input) {
    try {
      const response = await apiClient.get("/wholesaler/paymentDue", {
        params: {
          page: input.page || 0,          // Default to page 1 if not specified
          limit: input.limit || 10,       // Default to 10 items per page
          search: input.search || '',     // Empty string if no search term
          type: input.type || 'wholesaler' // Default to 'wholesaler' if not specified
        },
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
  async getTodayPaymentDues(input) {
    try {
      const response = await apiClient.get("/today-outstanding-payments/", {
        params: {
          page: input.page || 0,          // Default to page 1 if not specified
          limit: input.limit || 10,       // Default to 10 items per page
          search: input.search || '',     // Empty string if no search term
        },
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
  async adminForgotPasword(input) {
    console.log(input, "input")
    try {
      const response = await apiClient.post("/admin-check-mobile", {
        phoneNumber: input
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
      toast.error(error?.data?.errorDetails)
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }
  async changePassword(input) {
    console.log(input, "input")
    try {
      const response = await apiClient.post("/admin-change-password-by-id", {
        userId: input.userId,
        newPassword: input.newPassword
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
}

const apiProvider = new ApiProvider()
export default apiProvider
import { BaseApiService } from "../services/baseApiService";
import ShowNotifications from "../utils/notification";
class CategoryProvider extends BaseApiService {
  constructor() {
    super();
  }

  async addCategory(input) {
    try {
      const response = await this.post("/categories", input);

      if (response.status == 200 || response.status == 201) {
        // ShowNotifications.showAlertNotification(response.data.message, true);
        return {
          status: true,
        };
      } else {
        // ShowNotifications.showAlertNotification("Some thing went wrong", true);
        return {
          status: false,
        };
      }
    } catch (err) {
      // ShowNotifications.showAxiosErrorAlert(err);
      return {
        response: null,
        status: false,
      };
    }
  }
 async getCategorylist() {
    try {
      const response = await this.get("/categories");

      if (response.status == 200 || response.status == 201) {
        // ShowNotifications.showAlertNotification(response.data.message, true);
        return {
          status: true,
        };
      } else {
        // ShowNotifications.showAlertNotification("Some thing went wrong", true);
        return {
          status: false,
        };
      }
    } catch (err) {
      // ShowNotifications.showAxiosErrorAlert(err);
      return {
        response: null,
        status: false,
      };
    }
  }
  async getCategory() {
    return await this.get("/categories");
  }

  async updateCategory(id, input) {
    try {
      const response = await this.put(`/categories/${id}`, input)
      if (response.status == 200 || response.status == 201) {
        // ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          status: response.data
        }
      } else {
        // ShowNotifications.showAlertNotification('Some thing went wrong', true)
        return {
          status: response.data
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

  async deleteCategory(id) {
    try {
      const response = await this.delete(`/categories/${id}`);

      if (response.status == 200 || response.status == 201) {
        ShowNotifications.showAlertNotification(response.data.message, true);
        return {
          response: response.data,
          status: true,
        };
      } else {
        ShowNotifications.showAlertNotification("Some thing went wrong", true);
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
}

export default new CategoryProvider();

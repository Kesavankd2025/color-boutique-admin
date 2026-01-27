import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class productApi {

  async productcreate(input) {
    try {
      const response = await apiClient.post('/product', input);

      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message, true);
        return {
          status: true,
          data: response.data
        };
      } else {
        const errorMessage = response.data?.message || 'Something went wrong';
        return {
          status: false,
          error: errorMessage,
          response: response
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create product';
      ShowNotifications.showAlertNotification(errorMessage, false);
      return {
        status: false,
        error: errorMessage,
        response: error.response
      };
    }
  }

  async productList(input) {
    const params = {
      page: input.page || 0, 
      limit: input.limit || 100,
      search: input.search || "",
    };

    if (input?.filters) {
      if (input.filters.productCode) params.search = input.filters.productCode;
      if (input.filters.productName) params.search = input.filters.productName;
      if (input.filters.categoryName) params.search = input.filters.categoryName;
      if (input.filters.subCategoryName) params.search = input.filters.subCategoryName;
      if (input.filters.brandName) params.search = input.filters.brandName;
    }
    console.log(params, "params")
    try {
      const response = await apiClient.get('/product/list/dtls', {
        params
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

  async getAllproductList(input) {
    const params = {
      page: input.page || 0,  // Changed default to 1 as most APIs expect page numbering to start at 1
      limit: input.limit || 100,
    };

    console.log(params, "params")
    try {
      const response = await apiClient.get('/product/list/dtls', {
        params
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

    async getProductStockList(input) {
    const params = {
      page: input.page || 0,  // Changed default to 1 as most APIs expect page numbering to start at 1
      limit: input.limit || 100,
      stockType:input.stockType || "cureent-stock"
    };

    console.log(params, "params")
    try {
      const response = await apiClient.get('/product/list/dtls', {
        params
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


  async getProductsByCategoryId(input) {
    try {
      const response = await apiClient.get('/product/list/dtls', {
        params: {
          // type: "customer",
          // page: input.page,
          // limit: input.limit,
          categoryId: input,
          // subCategoryId: input.subCategoryId,
        }
      });
      // console.log(response, "response");


      if (response.status === 200) {
        const products = response.data;
        // ShowNotifications.showAlertNotification(response.data.message, true)
        // console.log("Products retrieved:", products);
        return { status: response.status, data: products };
      } else {
        // ShowNotifications.showAlertNotification('Some thing went wrong', true)

        // If the response status is not 200, return an error message
        return { status: response.status, error: 'Failed to fetch products' };
      }
    } catch (error) {
      // ShowNotifications.showAxiosErrorAlert(error)

      console.error("Error fetching products:", error);

      if (error.response) {
        return { status: error.response.status, error: error.response.data?.message || 'Server error' };
      } else if (error.request) {
        return { status: 500, error: 'Network error or no response from the server' };
      } else {
        // ShowNotifications.showAlertNotification('Some thing went wrong', true)

        return { status: 500, error: 'An unknown error occurred' };
      }
    }
  }
  async productDetails(input) {
    try {
      const response = await apiClient.get(`/product/${input}`)

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
  async createOffer(input) {
    console.log(input, "input")
    try {
      const response = await apiClient.post("/offer", input)
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
  async updateOffer(id, input) {
    console.log(input, "input")
    try {
      const response = await apiClient.patch(`/offer/${id}`, input)
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
  async getOffer(input) {
    try {
      const response = await apiClient.get("/offer", {
        params: {
          offerType: input.offerType,
          type: "customer"
        }
      })
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
  async deleteOffer(input) {
    try {
      const response = await apiClient.delete(`/offer/${input}`)
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
  async updateproduct(input, id) {
    try {
      const response = await apiClient.patch(`/product/edit/${id}`, input);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message, true);
        return {
          status: true,
          data: response.data
        };
      } else {
        const errorMessage = response.data?.message || 'Something went wrong';
        return {
          status: false,
          error: errorMessage,
          response: response
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create product';
      ShowNotifications.showAlertNotification(errorMessage, false);
      return {
        status: false,
        error: errorMessage,
        response: error.response
      };
    }
  }

  async deleteProduct(id) {
    try {
      const response = await apiClient.patch(`/product/delete/${id}`);

      if (response.status == 200 || response.status == 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          response: response.data,
          status: true
        }
      } else {
        //  ShowNotifications.showAlertNotification('Some thing went wrong', true)
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

  // async getproductSearch(input) {
  //   try {
  //     const response = await apiClient.get('/product/list/dtls', {
  //       params: {
  //         type: "customer",
  //         search: input
  //       }
  //     });
  //     // console.log(response, "response");


  //     if (response.status === 200) {
  //       const products = response.data;
  //       // ShowNotifications.showAlertNotification(response.data.message, true)
  //       // console.log("Products retrieved:", products);
  //       return { status: response.status, data: products };
  //     } else {
  //       // ShowNotifications.showAlertNotification('Some thing went wrong', true)

  //       // If the response status is not 200, return an error message
  //       return { status: response.status, error: 'Failed to fetch products' };
  //     }
  //   } catch (error) {
  //     // ShowNotifications.showAxiosErrorAlert(error)

  //     console.error("Error fetching products:", error);

  //     if (error.response) {
  //       return { status: error.response.status, error: error.response.data?.message || 'Server error' };
  //     } else if (error.request) {
  //       return { status: 500, error: 'Network error or no response from the server' };
  //     } else {
  //       // ShowNotifications.showAlertNotification('Some thing went wrong', true)

  //       return { status: 500, error: 'An unknown error occurred' };
  //     }
  //   }
  // }
  async createTax(input) {
    console.log(input, "input")
    try {
      const response = await apiClient.post("/tax", input)
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
  async getTax(input) {
    console.log(input, "input")
    try {
      const response = await apiClient.get("/tax", input)
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
  async updateTax(input, editId) {
    try {
      const response = await apiClient.put(`/tax/${editId}`, input)
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
  async deleteTax(input) {
    try {
      const response = await apiClient.delete(`/tax/${input}`)
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
  async changePassword(input) {
    console.log(input, "input")
    try {
      const response = await apiClient.put(`/users/reset-password`, input)
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
}

const productApis = new productApi()
export default productApis

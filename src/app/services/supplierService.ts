import Cookies from "js-cookie";
import BASE_URL from './apiService';

interface ISupplierService {
  getSupplierById(): Promise<ISupplier>;
  updateSupplier(supplier: ISupplier): Promise<ISupplier>;
  checkPasswordSupplier(email: string, password: string): Promise<any>;
changePasswordSupplier(supplier: ISupplier): Promise<ISupplier>;
}

const supplierService: ISupplierService = {
  async getSupplierById() {
    try {
      const response = await fetch(
        `${BASE_URL}/getSupplierbyId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, 
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supplier staff list");
      }
      const data = await response.json();
     
      return data;
    } catch (error) {
      console.error("Error fetching supplier staff list:", error);
      throw error;
    }
  },

  async updateSupplier(supplier) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateSupplier`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, 
          },
          body: JSON.stringify(supplier),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }

      const contentType = response.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

   
      return data;
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },
  async changePasswordSupplier(supplier) {
    try {
      const response = await fetch(
        `${BASE_URL}/changePasswordSupplier`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify(supplier),
        }
      );

      const text = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message);
        } catch (e) {
          throw new Error(text);
        }
      }

      if (response.headers.get("content-type")?.includes("application/json")) {
        const data = JSON.parse(text);
        return data;
      } else {
        return text; // Return the plain text response
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },

  async checkPasswordSupplier(email, password) {
    try {
      const response = await fetch(
        `${BASE_URL}/checkPasswordSupplier`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const text = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          return { success: false, message: errorData.message };
        } catch (e) {
          return { success: false, message: text };
        }
      }

      if (response.headers.get("content-type")?.includes("application/json")) {
        const data = JSON.parse(text);
        return { success: true, data };
      } else {
        console.log(text);
        return { success: true, data: text };
      }
    } catch (error) {
      console.error("Error fetching supplier password:", error);
      let errorMessage = "An unknown error occurred";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return { success: false, message: errorMessage };
    }
  },


};

export default supplierService;

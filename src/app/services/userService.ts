import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IUserService {
  getUsers(): Promise<any[]>;
  getUserById(): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  checkPasswordUser(email: string, password: string): Promise<any>;
  changePasswordUser(supplier: IUser): Promise<IUser>;
}

const userService: IUserService = {
  async getUsers() {
    try {
      const response = await fetch(`${BASE_URL}/getUsers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  },

  async getUserById() {
    try {
      const response = await fetch(
        `${BASE_URL}/getUserById`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenUser")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
 
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async updateUser(user) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateUser`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenUser")}`,
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
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
      console.error("Error updating user:", error);
      throw error;
    }
  },
  async changePasswordUser(user) {
    try {
      const response = await fetch(
        `${BASE_URL}/changePasswordUser`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenUser")}`,
          },
          body: JSON.stringify(user),
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
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async checkPasswordUser(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/checkPasswordUser`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenUser")}`,
        },
        body: JSON.stringify({ email, password }),
      });

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
      console.error("Error fetching user password:", error);
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

export default userService;

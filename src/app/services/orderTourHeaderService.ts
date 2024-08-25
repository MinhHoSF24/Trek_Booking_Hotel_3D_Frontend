import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IOrderTourHeaderService {
  getOrderTourHeaderByUserId(): Promise<IOrderTourHeader[]>;
  getOrderTourHeaderBySupplierId(): Promise<IOrderTourHeader[]>;
  getRevenueTourBySupplierId(): Promise<IOrderTourHeader[]>;
  countTotalOrderTourBySupplierId(): Promise<number>;
  getPercentChangeTourFromLastWeek():Promise<number>;
  getTotalRevenueTourBySupplierId(): Promise<number>;
  getPercentChangeRevenueTourFromLastWeek(): Promise<number>;
  getCurrentWeekRevenueTourBySupplierId(): Promise<IWeeklyRevenue>;
  getCurrentMonthOfYearRevenueTourBySupplierId(): Promise<IMonthlyRevenue>;
  getCurrentQuarterOfYearRevenueTourBySupplierId(): Promise<IQuarterlyRevenue>;
  getRevenueQuarterOfYearTourBySupplierId(year: number): Promise<IQuarterlyRevenue>;
  getRevenueTourBySupplierIdAndDateRange(startDate: Date, endDate: Date): Promise<IRevenueTourDateRange>;
  getRevenueTourMonthToYearBySupplierId(year: number):Promise<IRevenueTourMonthToYear>;
  updateOrderTourHeader(orderTourHeader: {
    id: number;
    process: string;
  }): Promise<IOrderTourHeader[]>;
}

const orderTourHeaderService: IOrderTourHeaderService = {
  async getOrderTourHeaderByUserId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getOrderTourHeaderByUserId`,
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
        throw new Error("Failed to fetch order tour headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order tour headers:", error);
      throw error;
    }
  },
  async getOrderTourHeaderBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getOrderTourHeaderBySupplierId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order tour headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order tour headers:", error);
      throw error;
    }
  },


  async getRevenueTourBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getRevenueTourBySupplierId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
     
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  
  async countTotalOrderTourBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/countTotalOrderTourBySupplierId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },

  async getPercentChangeTourFromLastWeek() {
    try {
      const response = await fetch(
        `${BASE_URL}/getPercentChangeTourFromLastWeek`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
 
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  

  async getTotalRevenueTourBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getTotalRevenueTourBySupplierId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  
  async getPercentChangeRevenueTourFromLastWeek() {
    try {
      const response = await fetch(
        `${BASE_URL}/getPercentChangeRevenueTourFromLastWeek`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  async getCurrentWeekRevenueTourBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getCurrentWeekRevenueTourBySupplierId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  async getCurrentMonthOfYearRevenueTourBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getCurrentMonthOfYearRevenueTourBySupplierId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  async getCurrentQuarterOfYearRevenueTourBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getCurrentQuarterOfYearRevenueTourBySupplierId`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  async getRevenueQuarterOfYearTourBySupplierId(year) {
    try {
      const response = await fetch(
        `${BASE_URL}/getRevenueQuarterOfYearTourBySupplierId?year=${year}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  async getRevenueTourBySupplierIdAndDateRange(startDate, endDate) {
    try {
      const response = await fetch(
        `${BASE_URL}/getRevenueTourBySupplierIdAndDateRange?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },

  async getRevenueTourMonthToYearBySupplierId(year) {
    try {
      const response = await fetch(
        `${BASE_URL}/getRevenueTourMonthToYearBySupplierId?year=${year}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order hotel headers");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel headers:", error);
      throw error;
    }
  },
  async updateOrderTourHeader(orderTourHeader) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateOrderTourHeader`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
          body: JSON.stringify(orderTourHeader),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order tour headers");
      }

      const responseData = await response.json();

      if (!responseData.data) {
        throw new Error("Empty response data from server");
      }

      return responseData.data;
    } catch (error) {
      console.error("Error fetching order tour headers:", error);
      throw error;
    }
  },
};

export default orderTourHeaderService;

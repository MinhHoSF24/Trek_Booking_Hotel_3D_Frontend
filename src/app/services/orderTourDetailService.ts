import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IOrderTourDetailService {
  getOrderTourDetailByOrderTourHeaderId(orderTourHeaderId: number): Promise<IOrderTourDetail>;
  getTop5TourOrders(): Promise<ITop5Tour>;
  getTop5TourInWeek():Promise<ITopTour>;
  getMostFrequentlyTourBySupplierIdAndDateRange(stareDate: Date, endDate: Date): Promise<ITourDateRange>;
}

const orderTourDetailService: IOrderTourDetailService = {
  async getOrderTourDetailByOrderTourHeaderId(orderTourHeaderId) {
    try {
      const response = await fetch(
        `${BASE_URL}/getOrderTourDetailByOrderTourHeaderId/${orderTourHeaderId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order tour detail");
      }
      const data = await response.json();
   
      return data;
    } catch (error) {
      console.error("Error fetching order tour detail:", error);
      throw error;
    }
  },
  async getTop5TourOrders() {
    try {
      const response = await fetch(
        `${BASE_URL}/getTop5TourOrders`,
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
        throw new Error("Failed to fetch order hotel detail");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel detail:", error);
      throw error;
    }
  },
  async getTop5TourInWeek() {
    try {
      const response = await fetch(
        `${BASE_URL}/getTop5TourInWeek`,
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
        throw new Error("Failed to fetch order hotel detail");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel detail:", error);
      throw error;
    }
  },
  async getMostFrequentlyTourBySupplierIdAndDateRange(stareDate, endDate) {
    try {
      const response = await fetch(
        `${BASE_URL}/getMostFrequentlyTourBySupplierIdAndDateRange?startDate=${stareDate}&endDate=${endDate}`,
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
        throw new Error("Failed to fetch order hotel detail");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel detail:", error);
      throw error;
    }
  },
};

export default orderTourDetailService;

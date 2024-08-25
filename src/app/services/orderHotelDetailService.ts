import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IOrderHotelDetailService {
  getOrderHotelDetailByOrderHotelHeaderId(orderHotelHeaderId: number): Promise<IOrderHotelDetail>;
  getTop5RoomOrders(): Promise<ITop5Room>;
  getTop5RoomInWeek(): Promise<ITopRoom>;
  getMostFrequentlyRoomBySupplierIdAndDateRange(startDate: Date, endDate:Date): Promise<IRoomDateRange>;
}

const orderHotelDetailService: IOrderHotelDetailService = {
  async getOrderHotelDetailByOrderHotelHeaderId(orderHotelHeaderId) {
    try {
      const response = await fetch(
        `${BASE_URL}/getOrderHotelDetailByOrderHotelHeaderId/${orderHotelHeaderId}`,
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
        throw new Error("Failed to fetch order hotel detail");
      }
      const data = await response.json();
    
      return data;
    } catch (error) {
      console.error("Error fetching order hotel detail:", error);
      throw error;
    }
  },
  async getTop5RoomOrders() {
    try {
      const response = await fetch(
        `${BASE_URL}/getTop5RoomOrders`,
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
  
  async getTop5RoomInWeek() {
    try {
      const response = await fetch(
        `${BASE_URL}/getTop5RoomInWeek`,
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
  async getMostFrequentlyRoomBySupplierIdAndDateRange(startDate, endDate) {
    try {
      const response = await fetch(
        `${BASE_URL}/getMostFrequentlyRoomBySupplierIdAndDateRange?startDate=${startDate}&endDate=${endDate}`,
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

export default orderHotelDetailService;

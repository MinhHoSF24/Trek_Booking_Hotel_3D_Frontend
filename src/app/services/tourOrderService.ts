import Cookies from "js-cookie";
import BASE_URL from './apiService';

interface ITourOrderService {
  getTourOrderBySupplierId(): Promise<ITourOrder[]>;
  updateTourOrder(tourOrder: {
    tourOrderId: number;
    userId: number;
    tourId: number;
    tourOrderDate: string | Date;
    tourOrderQuantity: number;
    tourTotalPrice: number;
    supplierId: number;
    isConfirmed: boolean;
    status: boolean;
  }): Promise<void>;
}

const tourOrderService: ITourOrderService = {
  async getTourOrderBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getTourOrderBySupplierId`,
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
        throw new Error("Failed to fetch tour order list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour order list:", error);
      throw error;
    }
  },
  
  async updateTourOrder(tourOrder) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateTourOrder/${tourOrder.tourOrderId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
          },
          body: JSON.stringify(tourOrder),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit tour order");
      }
      const updatedTourOrder = await response.json();
      console.log(updatedTourOrder); // Log updated booking details
      return updatedTourOrder;
    } catch (error) {
      console.error("Error editing booking:", error);
      throw error;
    }
  },
};

export default tourOrderService;

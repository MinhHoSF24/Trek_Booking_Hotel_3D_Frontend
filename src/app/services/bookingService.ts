import { mutate } from "swr";
import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IBookingService {
  getBookingsBySupplierId(): Promise<IBooking[]>;
  updateBooking(booking: {
    bookingId: number;
    userId: number;
    hotelId: number;
    roomId: number;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    totalPrice: number;
    roomQuantity: number;
    voucherCode: string;
    userNote: string;
    status: boolean;
    isConfirmed: boolean;
  }): Promise<void>;
}

const bookingService: IBookingService = {
  async getBookingsBySupplierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getBookingBySupplierId`,
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
        throw new Error("Failed to fetch booking list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching booking list:", error);
      throw error;
    }
  },
  async updateBooking(booking) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateBooking/${booking.bookingId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, 
          },
          body: JSON.stringify(booking),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit booking");
      }
      const updatedBooking = await response.json();
      console.log(updatedBooking); // Log updated booking details
      // mutate(this.getBookingsBySupplierId);
      return updatedBooking;
    } catch (error) {
      console.error("Error editing booking:", error);
      throw error;
    }
  },
};
export default bookingService;

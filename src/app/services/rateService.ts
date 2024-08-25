import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IRateService {
  getRatesByHotelId(hotelId: number): Promise<IRate[]>;
  getRatesByOrderHotelHeaderId(OrderHotelHeaderId: number): Promise<IRate[]>;
  rateBooking(rateData: IRate): Promise<any>;
}

const rateService: IRateService = {

  async getRatesByOrderHotelHeaderId(OrderHotelHeaderId) {
    //console.log(OrderHotelHeaderId);
    try {
      const response = await fetch(
        `${BASE_URL}/getRateByOrderHotelHeaderId/${OrderHotelHeaderId}`,
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
        throw new Error("Failed to fetch rate list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching rate list:", error);
      throw error;
    }
  },

  async getRatesByHotelId(hotelId) {
    console.log(hotelId);
    try {
      const response = await fetch(
        `${BASE_URL}/getRateByHotelId/${hotelId}`,
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
        throw new Error("Failed to fetch rate list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching rate list:", error);
      throw error;
    }
  },
  async rateBooking(rateData) {
    try {
      const response = await fetch(`${BASE_URL}/rateHotel`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenUser")}`, // Retrieve token from cookies
        },
        body: JSON.stringify(rateData),
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
      console.error("Error fetching rate:", error);
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

export default rateService;
import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IHotelImageService {
  getHotelImageByHotelId(hotelId: number): Promise<IHotelImage[]>;
  createHotelImage(hotelImage: IHotelImage): Promise<IHotelImage>;
  deleteHotelImage(hotelImageId: number): Promise<void>;
}

const hotelImageService: IHotelImageService = {
  async getHotelImageByHotelId(hotelId) {
    try {
      const response = await fetch(
        `${BASE_URL}/getHotelImagebyHotelId/${hotelId}`,
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
        throw new Error("Failed to fetch hotel image list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching hotel image list:", error);
      throw error;
    }
  },

  async createHotelImage(hotelImage) {
    try {
      const response = await fetch(`${BASE_URL}/createHotelImage`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(hotelImage),
      });
      if (!response.ok) {
        throw new Error("Failed to add hotel image");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding hotel image:", error);
      throw error;
    }
  },

  async deleteHotelImage(hotelImageId) {
    try {
      const response = await fetch(
        `${BASE_URL}/deleteHotelImage/${hotelImageId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
          },
          body: JSON.stringify({ status: false }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update hotel image status to false");
      }
    } catch (error) {
      console.error("Error updating hotel image to false:", error);
      throw error;
    }
  },
};

export default hotelImageService;

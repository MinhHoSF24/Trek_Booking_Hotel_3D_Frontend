import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IRoomImageService {
  getRoom3DImageByRoomId(roomId: number): Promise<IRoom3DImage[]>;
  createRoom3DImage(room3DImage: IRoom3DImage): Promise<IRoom3DImage>;
  deleteRoom3DImage(roomImage3DId: number): Promise<void>;
}

const roomImage3DService: IRoomImageService = {
  async getRoom3DImageByRoomId(roomId) {
    console.log(roomId);
    try {
      const response = await fetch(
        `${BASE_URL}/getRoom3DImagebyRoomId/${roomId}`,
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
        throw new Error("Failed to fetch room image list");
      }
      const data = await response.json();
      console.log(data); // Trigger refetch after fetching
      return data;
    } catch (error) {
      console.error("Error fetching room image list:", error);
      throw error;
    }
  },

  async createRoom3DImage(room3DImage) {
    try {
      const response = await fetch(`${BASE_URL}/createRoom3DImage`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
        },
        body: JSON.stringify(room3DImage),
      });
      if (!response.ok) {
        throw new Error("Failed to add room image");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding room image:", error);
      throw error;
    }
  },

  async deleteRoom3DImage(roomImage3DId) {
    try {
      const response = await fetch(
        `${BASE_URL}/deleteRoom3DImage/${roomImage3DId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
          },
          body: JSON.stringify({ status: false }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update room image status to false");
      }
    } catch (error) {
      console.error("Error updating room image status to false:", error);
      throw error;
    }
  },
};

export default roomImage3DService;

import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IRoomImageService {
  getRoomImageByRoomId(roomId: number): Promise<IRoomImage[]>;
  createRoomImage(roomImage: IRoomImage): Promise<IRoomImage>;
  deleteRoomImage(roomImageId: number): Promise<void>;
  getRoomImage(): Promise<any[]>;
}

const roomImageService: IRoomImageService = {
  async getRoomImage() {
    try {
      const response = await fetch(`${BASE_URL}/getRoomImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch room list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching room list:", error);
      throw error;
    }
  },
  async getRoomImageByRoomId(roomId) {
    try {
      const response = await fetch(
        `${BASE_URL}/getRoomImagebyRoomId/${roomId}`,
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
      return data;
    } catch (error) {
      console.error("Error fetching room image list:", error);
      throw error;
    }
  },

  async createRoomImage(roomImage) {
    try {
      const response = await fetch(`${BASE_URL}/createRoomImage`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
        },
        body: JSON.stringify(roomImage),
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

  async deleteRoomImage(roomImageId) {
    try {
      const response = await fetch(
        `${BASE_URL}/deleteRoomImage/${roomImageId}`,
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

export default roomImageService;

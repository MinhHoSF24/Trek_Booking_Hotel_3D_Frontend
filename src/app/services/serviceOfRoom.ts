import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IServiceOfRoom {
  getServiceByRoomId(roomId: number): Promise<IService[]>;
  createRoomService(roomService: IRoomService): Promise<IRoomService>;
  deleteRoomService(roomService: IRoomService): Promise<IRoomService>;
  getServices(): Promise<any[]>;
}

const serviceOfRoom: IServiceOfRoom = {
  async getServices() {
    try {
      const response = await fetch(`${BASE_URL}/getServices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch room list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching booking list:", error);
      throw error;
    }
  },

  async getServiceByRoomId(roomId) {
    console.log(roomId);
    try {
      const response = await fetch(
        `${BASE_URL}/api/RoomService/room/${roomId}/services`,
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
        throw new Error("Failed to fetch room list");
      }
      const data = await response.json();
      console.log(data); // Trigger refetch after fetching
      return data;
    } catch (error) {
      console.error("Error fetching room list:", error);
      throw error;
    }
  },

  async deleteRoomService(roomService) {
    console.log(roomService);
    try {
      const response = await fetch(
        `${BASE_URL}/deleteRoomService`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify(roomService), // Truyền dữ liệu roomService vào body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete room service");
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); // Handle plain text response
      }

      console.log(data);
      return data;
    } catch (error) {
      console.error("Error deleting room service:", error);
      throw error;
    }
  },

  async createRoomService(roomService) {
    try {
      const response = await fetch(
        `${BASE_URL}/createRoomService`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify(roomService),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create Room");
      }

      const contentType = response.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(data);
      return data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },
};

export default serviceOfRoom;

import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IRoomService {
  getRoomsByHotelId(hotelId: number): Promise<IRoom[]>;
  createRoom(room: IRoom): Promise<IRoom>;
  deleteRoom(roomId: number): Promise<IRoom>;
  recoverRoomDeleted(roomId: number): Promise<IRoom>;
  updateRoom(room: IRoom): Promise<IRoom>;
  getRooms(): Promise<any[]>;
  getRoomById(roomId: number): Promise<IRoom>;

  SearchRoomSchedule(hotelId: number, checkInDate: string, checkOutDate: string): Promise<IRoomAvailability[]>;
}

const roomService: IRoomService = {

  //láy số phòng trống
  async SearchRoomSchedule(hotelId: number, checkInDate: string, checkOutDate: string): Promise<IRoomAvailability[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/getRoomAvailability?hotelId=${hotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenUser")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
      }
      const data: IRoomAvailability[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      throw error;
    }
  },
   

  //
  async getRooms() {
    try {
      const response = await fetch(`${BASE_URL}/getRooms`, {
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

  async getRoomsByHotelId(hotelId) {
    try {
      const response = await fetch(
        `${BASE_URL}/getRoombyHotelId/${hotelId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
        }
      );
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

  async getRoomById(roomId) {
    try {
      const response = await fetch(
        `${BASE_URL}/getRoombyId/${roomId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
        }
      );
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

  async deleteRoom(roomId) {
    try {
      const response = await fetch(
        `${BASE_URL}/deleteRoom/${roomId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch room");
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); // Handle plain text response
      }

      return data;
    } catch (error) {
      console.error("Error fetching room:", error);
      throw error;
    }
  },

  async recoverRoomDeleted(roomId) {
    try {
      const response = await fetch(
        `${BASE_URL}/recoverRoomDeleted/${roomId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch room");
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); // Handle plain text response
      }

      return data;
    } catch (error) {
      console.error("Error fetching room:", error);
      throw error;
    }
  },

  async createRoom(room) {
    try {
      const response = await fetch(
        `${BASE_URL}/createRoom`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify(room),
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

      return data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  async updateRoom(room) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateRoom`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify(room),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Room");
      }

      const contentType = response.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return data;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },
};

export default roomService;

import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IHotelService {
  getHotelsBySuppierId(): Promise<IHotel[]>;
  getHotelById(hotelId: number): Promise<IHotel>;
  createHotel(hotel: IHotel): Promise<IHotel>;
  updateHotel(hotel: Partial<IHotel>): Promise<IHotel>;
  updateHotelAvatar(hotel: Partial<IHotel>): Promise<IHotel>;
  getHotels(): Promise<any[]>;
  deleteHotel(hotelId: number): Promise<IHotel>;
  recoverHotelDeleted(hotelId: number): Promise<IHotel>;
  searchHotelByCity(city: string): Promise<IHotel[]>;
  searchHotelSchedule(checkInDate: string, checkOutDate: string, city: string): Promise<IHotel[]>;
 // convertDateFormat(dateStr: string): string;
}

const hotelService: IHotelService = {
  async getHotels() {
    try {
      const response = await fetch(`${BASE_URL}/getHotels`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenUser")}` 
        },
      });
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

  async searchHotelByCity(city: string): Promise<IHotel[]> {
     try {
       const response = await fetch(
         `${BASE_URL}/searchHotelByCity?city=${encodeURIComponent(city)}`,
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
       const data: IHotel[] = await response.json();
       return data;
     } 
     catch (error) {
       console.error("Error fetching hotel details:", error);
       throw error;
     }
   },

  async searchHotelSchedule(checkInDate: string, checkOutDate: string, city: string): Promise<IHotel[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/searchHotelSchedule?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&city=${encodeURIComponent(city)}`,
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
      const data: IHotel[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      throw error;
    }
  },
   
  async getHotelsBySuppierId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getHotelsBySupplierId`,
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
        throw new Error("Failed to fetch hotel list");
      }
      const data = await response.json();
     
      return data;
    } 
    catch (error) {
      console.error("Error fetching hotel list:", error);
      throw error;
    }
  },

  async getHotelById(hotelId) {
    try {
      const response = await fetch(
        `${BASE_URL}/getHotelById/${hotelId}`,
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
      const data: IHotel = await response.json(); 
      return data;
    } 
    catch (error) {
      console.error("Error fetching hotel details:", error);
      throw error;
    }
  },

  async createHotel(hotel) {
    try {
      const response = await fetch(`${BASE_URL}/createHotel`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
        },
        body: JSON.stringify(hotel),
      });
      if (!response.ok) {
        throw new Error("Failed to create hotel");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating hotel:", error);
      throw error;
    }
  },

  async updateHotel(hotel) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateHotel`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify(hotel),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update hotel");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating hotel:", error);
      throw error;
    }
  },

  async updateHotelAvatar(hotel) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateHotelAvatar`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
          },
          body: JSON.stringify(hotel),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update hotel");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating hotel:", error);
      throw error;
    }
  },

  async deleteHotel(hotelId) {
    try {
      const response = await fetch(
        `${BASE_URL}/deleteHotel/${hotelId}`,
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
        throw new Error("Failed to fetch hotel");
      }
  
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); 
      }
  
   
      return data;
    } catch (error) {
      console.error("Error fetching hotel:", error);
      throw error;
    }
  },

  async recoverHotelDeleted(hotelId) {
    try {
      const response = await fetch(
        `${BASE_URL}/recoverHotelDeleted/${hotelId}`,
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
        throw new Error("Failed to fetch hotel");
      }
  
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); 
      }
  
     
      return data;
    } catch (error) {
      console.error("Error fetching hotel:", error);
      throw error;
    }
  },
};
export default hotelService;

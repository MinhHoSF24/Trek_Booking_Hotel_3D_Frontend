import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface ICommentService {
  getCommentsByHotelId(hotelId: number): Promise<IComment[]>;
  getCommentsByOrderHotelHeaderId(OrderHotelHeaderId: number): Promise<IComment[]>;
  commentBooking(commentData: IComment): Promise<any>;
  checkFeedback(orderHotelHeaderId: number): Promise<boolean>;
}

const commentService: ICommentService = {

  async getCommentsByOrderHotelHeaderId(OrderHotelHeaderId) {
    //console.log(hotelId);
    try {
      const response = await fetch(
        `${BASE_URL}/getCommentByOrderHotelHeaderId/${OrderHotelHeaderId}`,
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
        throw new Error("Failed to fetch comment list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching comment list:", error);
      throw error;
    }
  },


  async getCommentsByHotelId(hotelId) {
    console.log(hotelId);
    try {
      const response = await fetch(
        `${BASE_URL}/getCommentByHotelId/${hotelId}`,
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
        throw new Error("Failed to fetch comment list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching comment list:", error);
      throw error;
    }
  },
  async commentBooking(commentData) {
    try {
      const response = await fetch(`${BASE_URL}/createComment`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenUser")}`, // Retrieve token from cookies
        },
        body: JSON.stringify(commentData),
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
        // console.log(text);
        return { success: true, data: text };
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      let errorMessage = "An unknown error occurred";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return { success: false, message: errorMessage };
    }
  },
  async checkFeedback(orderHotelHeaderId) {
    try {
      const response = await fetch(
        `${BASE_URL}/checkFeedback/${orderHotelHeaderId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenUser")}`, // Retrieve token from cookies
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check feedback");
      }

      const hasFeedback = await response.json();
      return hasFeedback;
} catch (error) {
      console.error("Error checking feedback:", error);
      throw error;
    }
  }
  
};

export default commentService;
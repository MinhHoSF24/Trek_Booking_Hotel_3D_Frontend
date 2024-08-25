import { ITour } from "../entities/tour";
import Cookies from "js-cookie";
import BASE_URL from './apiService';

interface ITourImageService {
  getTourImageByTourId(tourId: number): Promise<ITourImage[]>;
  createTourImage(tourImage: ITourImage): Promise<ITourImage>;
  deleteTourImage(tourImageId: number): Promise<void>;
}

const tourImageService: ITourImageService = {
  async getTourImageByTourId(tourId) {
    console.log(tourId);
    try {
      const response = await fetch(
        `${BASE_URL}/getTourImageByTourId/${tourId}`,
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
        throw new Error("Failed to fetch tour image list");
      }
      const data = await response.json();
      console.log(data); // Trigger refetch after fetching
      return data;
    } catch (error) {
      console.error("Error fetching tour image list:", error);
      throw error;
    }
  },

  async createTourImage(tourImage) {
    try {
      const response = await fetch(`${BASE_URL}/createTourImage`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
        },
        body: JSON.stringify(tourImage),
      });
      if (!response.ok) {
        throw new Error("Failed to add tour image");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding tour image:", error);
      throw error;
    }
  },

  async deleteTourImage(tourImageId) {
    try {
      const response = await fetch(
        `${BASE_URL}/deleteTourImage/${tourImageId}`,
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
        throw new Error("Failed to delete tour image");
      }
    } catch (error) {
      console.error("Error deleting tour image:", error);
      throw error;
    }
  },
};

export default tourImageService;

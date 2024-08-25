import Cookies from "js-cookie";
import useSWR, { mutate } from 'swr';
import { ITour } from '../entities/tour';
import BASE_URL from './apiService';

interface ITourService {
  getToursBySuppierId(): Promise<ITour[]>;
  getTourImageByTourId(tourId: number): Promise<ITourImage[]>;
  getTourById(tourId: number): Promise<ITour>;
  getTours(): Promise<any[]>;

  searchTourByAddress(address: string): Promise<ITour[]>;
}

export const tourService: ITourService = {
//search tour
async searchTourByAddress(address: string): Promise<ITour[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/searchTourByAddress?address=${encodeURIComponent(address)}`,
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
      throw new Error("Failed to fetch Tours");
    }
    const data: ITour[] = await response.json();
    return data;
  } 
  catch (error) {
    console.error("Error fetching hotel details:", error);
    throw error;
  }
},

  async getTours() {
    try {
      const response = await fetch(`${BASE_URL}/getTours`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tour list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour list:", error);
      throw error;
    }
  },

  async getTourById(tourId) {
    try {
      const response = await fetch(`${BASE_URL}/getTourById/${tourId}`, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tour detail");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour detail", error);
      throw error;
    }
  },

  async getTourImageByTourId(tourId) {
    try {
      const response = await fetch(`${BASE_URL}/getTourImageByTourId/${tourId}`, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`, // Retrieve token from localStorage
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tour images");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour images:", error);
      throw error;
    }
  },

  async getToursBySuppierId() {
    try {
      const response = await fetch(`${BASE_URL}/getTourBySupplierId`, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tokenSupplier")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tour list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour list:", error);
      throw error;
    }
  },
};

export const revalidateTours = () => mutate(tourService.getToursBySuppierId);

export const createTour = async (
  tourName: string,
  tourDescription: string,
  tourPrice: number,
  tourAddress: string,
  tourTime: string,
  tourTransportation: string,
  tourCapacity: number,
  tourDiscount: number,
  tourDay: number,
  status: boolean,
  lock: boolean,
  supplierId: number
) => {
  const response = await fetch(`${BASE_URL}/createTour`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tourName, tourDescription, tourPrice, tourAddress, tourTime, tourTransportation, tourCapacity,tourDay, status,lock, supplierId, tourDiscount })
  });

  if (!response.ok) {
    throw new Error('Failed to create tour');
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text(); // Handle non-JSON response
  }
};

export const updateTour = async (
  tourId: number,
  tourName: string,
  tourDescription: string,
  tourPrice: number,
  tourAddress: string,
  tourTime: string,
  tourTransportation: string,
  tourCapacity: number,
  tourDiscount: number,
  tourDay:number,
  status: boolean,
  supplierId: number
) => {
  const response = await fetch(`${BASE_URL}/updateTour`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tourId, tourName, tourDescription, tourPrice, tourAddress, tourTime, tourTransportation, tourCapacity, tourDiscount, tourDay,status, supplierId })
  });

  if (!response.ok) {
    throw new Error('Failed to update tour');
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text(); // Handle non-JSON response
  }
};

export const toggleTourStatus = async (tourId: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/toggleTourStatus`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tourId })
    });

    if (!response.ok) {
      throw new Error('Failed to toggle tour status');
    }
  } catch (error: any) {
    throw new Error('Failed to toggle tour status: ' + error.message);
  }
};
export const lockTour = async (tourId: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/LockTour`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tourId })
    });

    if (!response.ok) {
      throw new Error('Failed to toggle tour status');
    }
  } catch (error: any) {
    throw new Error('Failed to toggle tour status: ' + error.message);
  }
};
export default tourService;

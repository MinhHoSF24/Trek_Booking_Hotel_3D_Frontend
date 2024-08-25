import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IVoucherService {
  getVouchersByHotelId(hotelId: number): Promise<IVoucher[]>;
  createVoucher(voucher: IVoucher): Promise<IVoucher>;
  updateVoucher(voucher: IVoucher): Promise<IVoucher>;
  deleteVoucher(voucherId: number): Promise<IVoucher>;
}

const voucherService: IVoucherService = {
  async getVouchersByHotelId(hotelId) {
    console.log(hotelId);
    try {
      const response = await fetch(
        `${BASE_URL}/getVouchersByHotelId/${hotelId}`,
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
        throw new Error("Failed to fetch voucher list");
      }
      const data = await response.json();
      console.log(data); // Trigger refetch after fetching
      return data;
    } catch (error) {
      console.error("Error fetching voucher list:", error);
      throw error;
    }
  },

  async createVoucher(voucher) {
    try {
      const response = await fetch(
        `${BASE_URL}/createVoucher`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(voucher),
        }
      );

      if (!response.ok && response.status == 409) {
        throw new Error("Voucher Code already exists");
      } else if (!response.ok) {
        throw new Error("Failed to create Voucher");
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
      console.error("Error creating voucher:", error);
      throw error;
    }
  },

  async updateVoucher(voucher) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateVoucher`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(voucher),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Voucher");
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
      console.error("Error updating voucher:", error);
      throw error;
    }
  },

  async deleteVoucher(voucherId) {
    console.log(voucherId);
    try {
      const response = await fetch(
        `${BASE_URL}/deleteVoucher/${voucherId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch voucher");
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
      console.error("Error fetching voucher:", error);
      throw error;
    }
  },
};

export default voucherService;

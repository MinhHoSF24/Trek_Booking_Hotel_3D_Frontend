import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IVoucherWalletService {
  getVoucherUsageHistoryByUserId(): Promise<IVoucherWallet[]>;
}

const voucherWalletService: IVoucherWalletService = {
  async getVoucherUsageHistoryByUserId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getVoucherUsageHistoryByUserId`,
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
        throw new Error("Failed to fetch voucher usage history");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching voucher usage history:", error);
      throw error;
    }
  },
};

export default voucherWalletService;

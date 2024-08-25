import Cookies from 'js-cookie';
import BASE_URL from './apiService';

interface IPaymentWalletService {
  getPaymentInforByUserId(): Promise<IPaymentWallet[]>;
}

const paymentWalletService: IPaymentWalletService = {
  async getPaymentInforByUserId() {
    try {
      const response = await fetch(
        `${BASE_URL}/getPaymentInforByUserId`,
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
        throw new Error("Failed to fetch booking list");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching booking list:", error);
      throw error;
    }
  },
};

export default paymentWalletService;

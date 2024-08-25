// services/paymentService.js
import stripePromise from './stripe';
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import BASE_URL from './apiService';

const handlePayment = async (paymentData: any, item: any) => {
  try {
    const response = await fetch(`${BASE_URL}/StripePayment/Create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error('Error from server:', errorDetail);
      return;
    }

    const { data: sessionId } = await response.json();
    const stripe = await stripePromise;

    if (stripe && sessionId) {
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        toast.error('Payment failed!');
      } else {
        toast.success('Payment successful!');
      }
    } else {
      console.error('Stripe or sessionId is missing.');
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};

const createBooking = async (bookingData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/createBooking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get("tokenUser")}` // Thêm token nếu cần thiết
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    // Kiểm tra nếu phản hồi không phải JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text(); // Nếu không phải JSON, trả về văn bản
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

const createTourOrder = async (bookingData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/createTourOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get("tokenUser")}` // Thêm token nếu cần thiết
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    // Kiểm tra nếu phản hồi không phải JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text(); // Nếu không phải JSON, trả về văn bản
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

const handleTourPayment = async (paymentData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/StripePayment/CreateTour`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get("tokenUser")}` // Thêm token nếu cần thiết
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error('Error from server:', errorDetail);
      return;
    }

    const { data: sessionId } = await response.json();
    const stripe = await stripePromise;

    if (stripe && sessionId) {
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        toast.error('Payment failed!');
      } else {
        toast.success('Payment successful!');
      }
    } else {
      console.error('Stripe or sessionId is missing.');
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
const clearCart = async (roomId: number) => {
  try {
    const token = Cookies.get("tokenUser");
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(`${BASE_URL}/StripePayment/${roomId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Error response:', responseText);
      console.error('HTTP status code:', response.status);
      throw new Error('Failed to clear cart');
    }

    console.log('Success response:', responseText);
    toast.success('Cart cleared successfully!');
  } catch (error) {
    console.error('Error clearing cart:', error);
    toast.error('Failed to clear cart.');
  }
};


const CreatePaymentInfor = async (paymentInfor: any) => {
  try {
    const response = await fetch(`${BASE_URL}/createPaymentInfor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get("tokenUser")}` // Thêm token nếu cần thiết
      },
      body: JSON.stringify(paymentInfor),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    // Kiểm tra nếu phản hồi không phải JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text(); // Nếu không phải JSON, trả về văn bản
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};
const CreateVoucherUsageHistory = async (voucherUsageHistory: any) => {
  try {
    const response = await fetch(`${BASE_URL}/createVoucherUsageHistory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get("tokenUser")}` // Thêm token nếu cần thiết
      },
      body: JSON.stringify(voucherUsageHistory),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    // Kiểm tra nếu phản hồi không phải JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text(); // Nếu không phải JSON, trả về văn bản
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export default {
  handlePayment,
  createBooking,
  createTourOrder,
  handleTourPayment,
  clearCart,
  CreatePaymentInfor,
  CreateVoucherUsageHistory
};
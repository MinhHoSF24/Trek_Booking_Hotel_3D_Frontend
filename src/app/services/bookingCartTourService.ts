import Cookies from 'js-cookie';
import BASE_URL from './apiService';

export async function addToBookingCartTour(data: any) {
  const response = await fetch(`${BASE_URL}/createCartTour`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorDetail = await response.text(); // Lấy text thay vì JSON
    console.error('Error adding to cart:', errorDetail);
    throw new Error('Failed to add to cart');
  }
}




// bookingCartTourService.ts
export async function getCartTourByUserId() {
  try {
    const response = await fetch(`${BASE_URL}/getCartTourByUserId`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("tokenUser")}`
      }
    });

    if (!response.ok) {
      // Nếu lỗi 500 thì trả về mảng rỗng
      if (response.status === 500) {
        return [];
      }
      throw new Error('Failed to fetch booking cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cart tours:', error);
    // Trả về mảng rỗng nếu có lỗi
    return [];
  }
}


export async function deleteCartTour(cartTourId: number) {
  const response = await fetch(`${BASE_URL}/deleteCartTour/${cartTourId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get("tokenUser")}`
    }
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    console.error('Error deleting cart tour:', errorDetail);
    throw new Error('Failed to delete cart tour: ' + errorDetail);
  }

  return await response.text(); // Lấy text thay vì JSON
}
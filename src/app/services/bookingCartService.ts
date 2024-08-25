import Cookies from 'js-cookie';
import BASE_URL from './apiService';
import { getCartTourByUserId } from './bookingCartTourService';


export const getTotalCartItems = async () => {
  try {
    const [rooms, tours] = await Promise.all([
      getBookingCartByUserId(),
      getCartTourByUserId()
    ]);

    const totalItems = rooms.length + tours.length;

    return totalItems;
  } catch (error) {
    console.error('Error fetching total cart items:', error);
    return 0; // Trả về 0 nếu có lỗi
  }
};


export async function addToBookingCart(data: any) {
  const response = await fetch(`${BASE_URL}/createBookingCart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get("tokenUser")}`
    },
    body: JSON.stringify(data)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Failed to add to booking cart');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
}

export async function getBookingCartByUserId() {
  const response = await fetch(`${BASE_URL}/getBookingCartByUserId`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get("tokenUser")}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch booking cart');
  }

  return await response.json();
}

export async function getRoomById(roomId: number) {
  const response = await fetch(`${BASE_URL}/getRoombyId/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch room details');
  }

  return await response.json();
}

export async function getHotelById(hotelId: number) {
  const response = await fetch(`${BASE_URL}/getHotelById/${hotelId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hotel details');
  }

  return await response.json();
}

export async function getRoomImagesByRoomId(roomId: number) {
  const response = await fetch(`${BASE_URL}/getRoomImagebyRoomId/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch room images');
  }

  return await response.json();
}

export const deleteBookingCart = async (cartId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/deleteBookingCart/${cartId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete booking cart item');
  }
};

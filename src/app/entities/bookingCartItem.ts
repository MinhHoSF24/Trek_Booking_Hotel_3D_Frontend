export interface BookingCartItem {
    bookingCartId: number;
    userId: number;
    hotelId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    roomQuantity: number;
    voucherCode?: string;
    userNote?: string;
  }
  
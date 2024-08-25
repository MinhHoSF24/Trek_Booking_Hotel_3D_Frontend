interface IBooking{
    bookingId: number;
    userId: number;
    user: {
        userId: number;
        email: string;
        userName: string;
    };
    hotelId: number;
    hotel: {
        hotelId: number;
        hotelName: string;
    };
    roomId: number;
    room: {
        roomId: number;
        roomName: string;
    };
    checkInDate: string|Date;
    checkOutDate: string|Date;
    totalPrice: number;
    roomQuantity: number;
    voucherCode: string;
    userNote: string;
    status: boolean;
    isConfirmed: boolean;
}
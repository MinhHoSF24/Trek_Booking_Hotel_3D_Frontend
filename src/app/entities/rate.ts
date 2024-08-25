interface IRate{
    rateId: number;
    rateValue: number;
    bookingId: number;
    userId: number;
    user?: {
        userId: number;
        userName: string;
        email: string;
        avatar: string;
    }
    hotelId: number;
    hotel?:{
        hotelId: number;
        hotelName: string;
    }
    orderHotelHeaderId: number;
}
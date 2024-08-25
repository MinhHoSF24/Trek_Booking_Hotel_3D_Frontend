interface IComment{
    commentId: number;
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
    dateSubmitted: string|Date;
    message: string;
    orderHotelHeaderId: number;
}
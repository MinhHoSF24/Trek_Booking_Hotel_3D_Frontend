interface IHotel{
    hotelId: number;
    hotelName: string;
    hotelPhone: string;
    hotelEmail: string;
    hotelAvatar: string;
    hotelFulDescription: string;
    hotelDistrict: string;
    hotelCity: string;
    hotelInformation: string;
    supplierId: number;
    isVerify: boolean;
    lock: boolean;
    services: string[];
}
interface IOrderHotelHeader{
    id: number;
    userId: number;
    supplierId: number;
    totalPrice: number;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    sessionId: number;
    paymentIntentId: number;
    fullName: string;
    email:string;
    phone: string;
    requirement: string;
    voucherCode: string; 
    process: string;
    completed: boolean;
}
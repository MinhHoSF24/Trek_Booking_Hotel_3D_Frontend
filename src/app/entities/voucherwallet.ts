interface IVoucherWallet{
    userVoucherId: number;
    userId: number;
    user: {
        userId: number;
        email: string;
        userName: string;
    };
    voucherId: number;
    voucher: {
        voucherId: number;
        voucherCode: string;
        discountPercent: number;
       availableDate:string|Date;
    };
    orderHotelHeaderlId: number;
    orderHotelHeader:{
        checkInDate: Date;
        voucherCode: string;
        process: string;
    }
}
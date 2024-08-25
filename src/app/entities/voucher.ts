interface IVoucher{
    voucherId: number;
    voucherCode: string;
    availableDate:string|Date;
    expireDate: string|Date;
    voucherQuantity: number;
    discountPercent: number;
    voucherStatus: boolean;
    hotelId: number
}
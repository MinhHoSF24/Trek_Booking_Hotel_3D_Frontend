interface IPaymentWallet{
    paymentInforId: number;
    paymentMethod: string;
    cartNumber: number;
    totalPrice: number;
    paymentFee: number;
    paidDate: string|Date;
    userId: number;
}
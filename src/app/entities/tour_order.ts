interface ITourOrder{
    tourOrderId: number;
    userId: number;
    user: {
        userId: number;
        email: string;
        userName: string;
    };
    tourId: number;
    tour: {
        tourId: number;
        tourName: string;
    };
    tourOrderDate: string | Date;
    tourOrderQuantity: number;
    tourTotalPrice: number;
    supplierId: number;
    isConfirmed: boolean;
    status: boolean;
}
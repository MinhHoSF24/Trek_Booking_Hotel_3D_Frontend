export interface ITour{
    tourId: number;
    tourName: string;
    tourDescription: string;
    tourPrice: number;
    tourAddress: string;
    tourTime: string|Date;
    tourTransportation: string;
    tourCapacity: number;
    tourDiscount: number;
    tourDay: number;
    status: boolean;
    lock: boolean;
    supplierId: number;

}
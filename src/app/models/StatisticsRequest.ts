
export interface StatisticsRequest {
    StartDate: Date | undefined;
    EndDate: Date | undefined;
	ProductsIds: number[];
    StoresIds: number[];
}

export interface StatisticResponse {
    Date: Date,
    Store: string,
    Product: string,
    MaxPrice: number,
    AvgPrice: number
}
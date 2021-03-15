
export interface StatisticsRequest {
    StartDate: Date | undefined;
    EndDate: Date | undefined;
	ProductsIds: number[];
    StoresIds: number[];
}

export interface StatisticsResponse {
    name: string;
    series: StatisticsValue[]
}

export interface StatisticsValue {
    name: string;
    value: number;
}

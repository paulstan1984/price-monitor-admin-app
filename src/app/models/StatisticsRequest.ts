
export interface StatisticsRequest {
    StartDate: Date | string | undefined | null;
    EndDate: Date | string | undefined | null;
	ProductsIds: number[];
    StoresIds: number[];
}

export interface StatisticsResponse {
    name: string;
    series: StatisticsValue[]
}

export interface StatisticsValue {
    name: Date;
    value: number;
}

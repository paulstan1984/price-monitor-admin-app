import { SearchRequest } from "./SearchRequest";

export interface PricesSearchRequest extends SearchRequest {
    product: string;
	store: string;
}

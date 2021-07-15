import { SearchRequest } from "./SearchRequest";

export interface UsersSearchRequest extends SearchRequest {
    name: string | undefined;
}

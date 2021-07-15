import { EditableObject } from "./EditableObject";

export interface User extends EditableObject {
    id: number;
    name: string;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}
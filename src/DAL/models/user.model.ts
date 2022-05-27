import DateTimeFormat = Intl.DateTimeFormat;

export interface UserModel {
    id: number;
    created_at: DateTimeFormat;
    updated_at: DateTimeFormat;
    email: string;
    hash: string;
    hashed_refresh_token?: string;
}
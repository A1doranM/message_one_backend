import DateTimeFormat = Intl.DateTimeFormat;

export interface UserModel {
    id: number;
    createdAt: DateTimeFormat;
    updatedAt: DateTimeFormat;
    email: string;
    hash: string;
    hashedRefreshToken?: string;
}
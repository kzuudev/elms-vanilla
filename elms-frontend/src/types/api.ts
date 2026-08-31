export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
}

export type ApiErrorBody = ApiResponse<null>;
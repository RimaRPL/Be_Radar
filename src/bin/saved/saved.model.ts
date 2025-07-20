export interface CreateSavedNews {
    newsId: string;
}

export interface GetSavedNews {
    newsId: string;
    search?: string;
    periode: number;
    page: number;
    quantity: number;
}

export interface DeleteSavedNews {
    id: string;
}
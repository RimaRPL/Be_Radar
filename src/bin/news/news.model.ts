export interface CreateNewsRequest {
  image: string;
  pdfUrl: string;
  publishedAt: Date;
}

export interface UpdateNewsRequest {
  image?: string;
  pdfUrl?: string;
  publishedAt?: Date;
}

export interface getNewsById {
  id: string;
}

export interface getNews {
  search?: string;
  periode: number;
  page: number;
  quantity: number;
}

export interface deleteNews {
   id: string;
}

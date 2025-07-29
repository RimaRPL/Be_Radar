export interface CreateNewsRequest {
  image: string;
  pdfUrl: string;
  publishedAt: Date;
  region?: string; // Optional, default to "TULUNGAGUNG"
}

export interface UpdateNewsRequest {
  image?: string;
  pdfUrl?: string;
  publishedAt?: Date;
  region?: string; // Optional, can be "TULUNGAGUNG", "BLITAR", or "TRENGGALEK"
}

export interface getNewsById {
  id: string;
}

export interface getNews {
  search?: string;
  periode: number;
  page: number;
  quantity: number;
  region?: string; // Optional, can be "TULUNGAGUNG", "BLITAR", or "TRENGGALEK"
}

export interface deleteNews {
   id: string;
}

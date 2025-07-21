export interface commentModel {
    newsId: string;
    content: string;
}

export interface deleteModel {
    id: string;
}

export interface getcommentModel {
  search?: string;
  periode: number;
  page: number;
  quantity: number;
}
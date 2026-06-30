export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type GetCategoriesResponse = Category[];


export interface CreateCategoryRequest {
  name: string;
}

export type UpdateCategoryRequest = CreateCategoryRequest;

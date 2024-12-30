export interface Category {
    id: number;
    name: string;
    code: string;
    description: string;
    image: File;
    imageUrl: string; //
    children: Category[];
    createdAt: string;
    root: boolean;
    parentId?: number | null;
  }


  export interface SearchParams {
    [key: string]: string | number | boolean | null | undefined;
  }


// Ajoutez une interface pour le type de Page
export interface Page<T> {
  _embedded: {
    categoryList: T[];
  };
  _links: {
    self: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}


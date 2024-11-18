export interface Category {
    id: number;
    name: string;
    code: string;
    description: string;
    image: File;
    children: Category[];
    createdAt: string;
    root: boolean;
    parentId?: number | null;
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


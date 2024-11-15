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
    content: T[];
    pageable: any;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  }

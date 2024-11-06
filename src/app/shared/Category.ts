export interface Category {
    id: number;
    name: string;
    //description: string,
    parentId: number | null;
    children: Category[];
    //image: string,
    createdAt: string; 
    selected: boolean;
    root: boolean;
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

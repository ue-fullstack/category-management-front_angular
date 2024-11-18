import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Page } from '../shared/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiURL : string  = "http://localhost:8080/api/categories";
  constructor(private http: HttpClient) { }

   // récuperer toutes les categories
   getAllCategories () : Observable<Page<Category>> {
    return this.http.get<Page<Category>>(this.apiURL)
  }

  // récuperer toutes les categories
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiURL}/${id}`);
  }

 //supprimer
 deleteCategoryById(id : number): Observable <Category> {
  return this.http.delete <Category>(`${this.apiURL}/${id}`);
}

updateCategory(id: number, category: Category | FormData): Observable<Category> {
  return this.http.put<Category>(`${this.apiURL}/${id}`, category);
}

// Créer une catégorie
createCategory(categoryData: Category | FormData): Observable<Category> {
  return this.http.post<Category>(`${this.apiURL}`, categoryData);
}


}

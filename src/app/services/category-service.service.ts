import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Page } from '../shared/Category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {
  apiURL : string  = "http://localhost:8080/api/categories";
  constructor(private http: HttpClient) { }

  // créer une categorie 
  createCategory(obj : Category): Observable <Category> {
    return this.http.post <Category>(`${this.apiURL}`,obj);
  }


  // récuperer toutes les categories
  getAllCategories () : Observable<Page<Category>> {
    return this.http.get<Page<Category>>(this.apiURL)
 }

  // récuperer toutes les categories
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiURL}/${id}`);
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Page, SearchParams } from '../shared/Category';
import { ProgressService } from './progress.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  

  apiURL : string  = "http://localhost:8080/api/categories";
  constructor(private http: HttpClient, private progressService: ProgressService) { }

   // récuperer toutes les categories
  getAllCategories(): Observable<Page<Category>> {
    this.progressService.show();
    return this.http.get<Page<Category>>(this.apiURL).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  // récuperer une catégorie par ID
  getCategoryById(id: number): Observable<Category> {
    this.progressService.show();
    return this.http.get<Category>(`${this.apiURL}/${id}`).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  // supprimer une catégorie
  deleteCategoryById(id: number): Observable<Category> {
    this.progressService.show();
    return this.http.delete<Category>(`${this.apiURL}/${id}`).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

// mettre à jour une catégorie
updateCategory(id: number, category: Category | FormData): Observable<Category> {
  this.progressService.show();
  return this.http.put<Category>(`${this.apiURL}/${id}`, category).pipe(
    finalize(() => {
      this.progressService.hide();
    })
  );
}

// Créer une catégorie
createCategory(categoryData: Category | FormData): Observable<Category> {
  this.progressService.show();
  return this.http.post<Category>(this.apiURL, categoryData).pipe(
    finalize(() => {
      this.progressService.hide();
    })
  );
}

//recherche de categories
searchCategories(params: SearchParams): Observable<Page<Category>> {
  let queryParams = new HttpParams();
  
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== null && value !== undefined) {
      queryParams = queryParams.append(key, String(value)); // Convertit en chaîne pour HttpParams
    }
  });

  return this.http.get<Page<Category>>(`${this.apiURL}/search`, { params: queryParams }).pipe(
    finalize(() => {
      this.progressService.hide();
    })
  );
}


}

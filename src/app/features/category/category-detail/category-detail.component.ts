import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../shared/Category';
import { CategoryServiceService } from '../../../services/category-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent {

  categoryService = inject(CategoryServiceService);
  category: Category | null = null; 

  activateRoute = inject(ActivatedRoute);

  constructor() {
    this.activateRoute.params.subscribe((params: any) => {
      const id = +params['id'];
      if (id) {
        this.getCategoryById(id);
      }
    });
  }

  getCategoryById(id: number) {
    this.categoryService.getCategoryById(id).subscribe((res: Category) => {
      this.category = res;
    }, error => {
      alert("Erreur lors de la récupération des données de la catégorie.");
    });
  }

}

import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../shared/Category';
import { ActivatedRoute } from '@angular/router';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent {
  categoryService = inject(CategoryService);
  category: Category | null = null;

  activateRoute = inject(ActivatedRoute);

  constructor(private alertService: AlertService) {

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
      // Assurez-vous que les enfants sont correctement chargés
      if (this.category.children) {
        console.log('Nombre d\'enfants:', this.category.children.length);
      }
    }, error => {
      this.alertService.showAlert("Erreur lors de la récupération des données de la catégorie.");
    });
  }
}

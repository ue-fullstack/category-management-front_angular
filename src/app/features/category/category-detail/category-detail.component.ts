/* eslint-disable */

import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../shared/Category';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
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

  route = inject(Router);
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
    this.categoryService.getCategoryById(id).subscribe({
      next: (category: Category) => {
        this.category = category;
        if (this.category.children) {
          console.log('Nombre d\'enfants:', this.category.children.length);
        }
      },
      error: (error) => {
        this.alertService.showError(error);
      }
    });
  }

  trackByFn(index: number, item: Category) {
    return item.id; // Utilisez l'ID de la catégorie pour le suivi
  }

  viewDetails(id: number){
    this.route.navigate(['categorydetail', id]);
  }

}

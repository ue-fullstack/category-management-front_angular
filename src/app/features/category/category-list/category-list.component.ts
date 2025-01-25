import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category, Page } from '../../../shared/Category';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  activateRoute = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  categoryList: Category[] = [];
  route = inject(Router);

  constructor(private alertService: AlertService) {
    this.getAllCategories();
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  viewDetails(id: number) {
    this.route.navigate(['categorydetail', id]);
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(
      (res: Page<Category>) => {
        this.categoryList = res._embedded.categoryList;
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
    if (isDelete) {
      this.categoryService.deleteCategoryById(id).subscribe(
        (res: Category) => {
          this.alertService.showSuccess('Catégorie supprimée avec succès');
          this.getAllCategories();
        },
        error => {
          this.alertService.showError(error);
        }
      );
    }
  }

  getCategoryNameById(id: number): string | null {
    const parentCategory = this.categoryList.find(category => category.id === id);
    return parentCategory ? parentCategory.name : null;
  }

  trackByFn(index: number, item: Category) {
    return item.id; // Utilisez l'ID de la catégorie pour le suivi
  }
}

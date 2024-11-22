import { Component, inject, OnInit } from '@angular/core';
import { Category, Page } from '../../../shared/Category';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  activateRoute = inject(ActivatedRoute);
  categoryService = inject(CategoryService);

  categoryList: Category[] = [];
  filteredCategoryList: Category[] = [];
  route = inject(Router);

  constructor(private alertService: AlertService) {
    this.getAllCategories();
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  onView(id: number) {
    this.route.navigate(['categorydetail', id]);
  }

  onUpdate(id: number) {
    this.route.navigate(['createcategory', id]);
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(
      (res: Page<Category>) => {
        this.categoryList = res._embedded.categoryList;
        this.filteredCategoryList = this.categoryList; // Initialiser avec toutes les catégories
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
          this.alertService.showAlert('Catégorie supprimée avec succès');
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

  filterCategories(event: Event) {
    const target = event.target as HTMLSelectElement;
    const criteria = target.value;
    switch (criteria) {
      case 'parent':
        this.filteredCategoryList = this.categoryList.filter(category => category.children.length > 0);
        break;
      case 'children':
        this.filteredCategoryList = this.categoryList.filter(category => category.parentId !== null);
        break;
      case 'root':
        this.filteredCategoryList = this.categoryList.filter(category => category.root);
        break;
      default:
        this.filteredCategoryList = this.categoryList;
        break;
    }
  }
}

/* eslint-disable */

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Page } from '../../../shared/Category';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  allCategories: Category[] = [];

  parentCategories: Category[] = [];
  childCategories: Category[] = [];

  selectedChildren: Category[] = [];
  isEditing = false;
  selectedFile: File | null = null;
  isParentMode = true;
  imagePreview: string | ArrayBuffer | File | null = null;

  router = inject(Router);
  activateRoute = inject(ActivatedRoute);
  aCategory: Category | null = null;

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      parentId: [''],
      children: [[]]
    });

    this.activateRoute.params.subscribe((params: any) => {
      const id = +params['id'];
      if (id) {
        this.getCategoryById(id);
      }
    });
  }

  ngOnInit() {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadCategory(+id);
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((res: Page<Category>) => {
      this.allCategories = res._embedded.categoryList;

      // Filtrer les catégories parent
      this.parentCategories = this.allCategories.filter(category => category.children.length > 0);

      // Filtrer les catégories enfant
      this.childCategories = this.allCategories.filter(category => category.parentId !== null);

      this.updateAvailableChildren();
    }, error => {
      this.alertService.showAlert(error);
    });
  }

  loadCategory(id: number) {
    this.categoryService.getCategoryById(id).subscribe(
      category => {
        this.categoryForm.patchValue(category);
        if (category.parentId) {
          this.isParentMode = true;
          this.categoryForm.get('parentId')?.setValue(category.parentId);
        } else if (category.children && category.children.length > 0) {
          this.isParentMode = false;
          this.selectedChildren = category.children;
          this.updateAvailableChildren();
        }
        if (category.image) {
          this.imagePreview = category.image;
        }
      }
    );
  }

  updateAvailableChildren() {
    this.childCategories = this.allCategories.filter(c =>
      !this.selectedChildren.some(sc => sc.id === c.id) &&
      c.id !== this.categoryForm.get('id')?.value
    );
  }

  toggleChildSelection(child: Category) {
    const index = this.selectedChildren.findIndex(c => c.id === child.id);
    if (index > -1) {
      this.selectedChildren.splice(index, 1);
    } else {
      this.selectedChildren.push(child);
    }
    this.updateAvailableChildren();
  }

  isChildSelected(child: Category): boolean {
    return this.selectedChildren.some(c => c.id === child.id);
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    this.selectedFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  toggleParentChildren() {
    if (this.isParentMode) {
      this.categoryForm.get('children')?.setValue([]);
    } else {
      this.categoryForm.get('parentId')?.setValue('');
    }
  }

  getCategoryById(id: number) {
    this.categoryService.getCategoryById(id).subscribe((res: Category) => {
      this.aCategory = res;
      // Assurez-vous que les enfants sont correctement chargés
      if (this.aCategory.children) {
        console.log('Nombre d\'enfants:', this.aCategory.children.length);
      }
    }, error => {
      this.alertService.showError(error)
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')?.value);
      formData.append('description', this.categoryForm.get('description')?.value);

      const parentId = this.categoryForm.get('parentId')?.value;
      if (parentId !== null && parentId !== '') {
        formData.append('parentId', parentId);
      }

      formData.append('root', this.isParentMode ? 'true' : 'false');

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      const childrenIds = this.selectedChildren.map(child => child.id.toString());
      if (childrenIds.length > 0) {
        childrenIds.forEach(id => formData.append('childrenIds', id));
      }

      if (this.isEditing) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.categoryService.updateCategory(+id, formData).subscribe(
            response => {
              console.log('Catégorie mise à jour avec succès', response);
              this.alertService.showAlert('Categorie mise à jour avec succès');
              this.router.navigate(['/management']); // Rafraîchir la page
            },
            error => this.alertService.showError(error)
          );
        }
      } else {
        this.categoryService.createCategory(formData).subscribe(
          response => {
            console.log('Catégorie créée avec succès', response);
            this.alertService.showAlert("Catégorie crée avec succès");
            this.router.navigate(['/management']); // Rafraîchir la page
          },
          error => this.alertService.showError(error)
        );
      }
    }
  }
}
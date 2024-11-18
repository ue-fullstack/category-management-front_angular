import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgControlStatus, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Page } from '../../../shared/Category';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  allCategories: Category[] = [];
  availableChildren: Category[] = [];
  selectedChildren: Category[] = [];
  isEditing = false;
  selectedFile: File | null = null;
  isParentMode = true;
  imagePreview: string | ArrayBuffer | File | null = null;

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
      this.updateAvailableChildren();
    }, error => {
      this.alertService.showAlert("API error");
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
    this.availableChildren = this.allCategories.filter(c => 
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
      this.alertService.showAlert("Erreur lors de la récupération des données de la catégorie.");
    });
  }



  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = new FormData();
      Object.keys(this.categoryForm.value).forEach(key => {
        if (key === 'parentId') {
          const parentId = this.categoryForm.get(key)?.value;
          if (parentId !== null && parentId !== '') {
            formData.append(key, parentId);
          }
        } else if (key === 'children') {
          formData.append(key, JSON.stringify(this.selectedChildren.map(c => c.id)));
        } else {
          formData.append(key, this.categoryForm.get(key)?.value);
        }
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      if (this.isEditing) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.categoryService.updateCategory(+id, formData).subscribe(
            response => {
              console.log('Catégorie mise à jour avec succès', response);
              this.alertService.showAlert('Categorie mise à jour avec succès');
            },
            error => console.error('Erreur lors de la mise à jour de la catégorie', error)
          );
        }
      } else {
        this.categoryService.createCategory(formData).subscribe(
          response => {
            console.log('Catégorie créée avec succès', response);
            this.alertService.showAlert("Catégorie crée avec succès");
          },
          error => console.error('Erreur lors de la création de la catégorie', error)
        );
      }
    }
  }



}

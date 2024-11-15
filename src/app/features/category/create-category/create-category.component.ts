import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgControlStatus, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Page } from '../../../shared/Category';
import { CategoryService } from '../../category.service';
import { ActivatedRoute, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  isEditing = false;
  selectedFile: File | null = null;
  isParentMode = true;
  imagePreview: string | ArrayBuffer | File |null = null;

  activateRoute = inject(ActivatedRoute);
  aCategory: Category | null = null;

  constructor(
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

    //recuperer l'id passé dans le url
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
      this.categories = res.content;
    }, error => {
      alert("API error");
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
          this.categoryForm.get('children')?.setValue(category.children.map(c => c.id));
        }
        if (category.image) {
          this.imagePreview = category.image; // Assurez-vous que l'URL de l'image est correcte
        }
      }
    );
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
      alert("Erreur lors de la récupération des données de la catégorie.");
    });
  }



  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = new FormData();
      Object.keys(this.categoryForm.value).forEach(key => {
        if (key === 'children' && !this.isParentMode) {
          formData.append(key, JSON.stringify(this.categoryForm.get(key)?.value));
        } else if (key !== 'children' || this.isParentMode) {
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
              // Rediriger ou afficher un message de succès
            },
            error => console.error('Erreur lors de la mise à jour de la catégorie', error)
          );
        }
      } else {
        this.categoryService.createCategory(formData).subscribe(
          response => {
            console.log('Catégorie créée avec succès', response);
            // Rediriger ou afficher un message de succès
          },
          error => console.error('Erreur lors de la création de la catégorie', error)
        );
      }
    }
  }

}

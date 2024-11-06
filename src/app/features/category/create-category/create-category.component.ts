import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryServiceService } from '../../../services/category-service.service';
import { Category } from '../../../shared/Category';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {
  categoryService = inject(CategoryServiceService);
  categoryList: Category[] = [];

  constructor (){
    this.initializeForm();
  }

  categoryForm : FormGroup = new FormGroup({});
  initializeForm (data ?: Category){
    this.categoryForm = new FormGroup({
      id: new FormControl(data ? data.id : 0),
      name: new FormControl( data ? data.name : ""),
      //description: new FormControl( data ? data.description : ""),
      //image: new FormControl( data ? data.image : ""),
      parentid: new FormControl(data ? data.parentId : null),
      children: new FormControl(data ? data.children :[]),
      createdAt: new FormControl(data ? data.createdAt :""),
      selected: new FormControl(data ? data.selected :false),
      root: new FormControl(data ? data.root :true)
    })
  }


  onCreateCategory() {
    const formValue = this.categoryForm.value;
    this.categoryService.createCategory(formValue).subscribe((res: Category)=>{
     alert("Category created with success");
      this.categoryForm.reset();
    }, error=>{
      alert("API error");
    })
  }

}

import { Component, inject, OnInit } from '@angular/core';
import { Category, Page } from '../../../shared/Category';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent implements OnInit{

  activateRoute = inject(ActivatedRoute);
  categoryService = inject(CategoryService);

  categoryList: Category[] = [];
  route = inject(Router);
  
  constructor(private alertService: AlertService){
    this.getAllCategories();
  }

  onView(id: number){
    this.route.navigate(['categorydetail', id]);
  }

  onUpdate(id: number){
    this.route.navigate(['createcategory', id]);
  }

  getAllCategories(){
    this.categoryService.getAllCategories().subscribe((res: Page<Category>)=>{
      this.categoryList = res._embedded.categoryList;
     }, error=>{
       this.alertService.showAlert("API error");
     })
  }

  onDelete(id : number){
    const isDelete = confirm('Êtes-vous sûr de voiloir supprimer cette catégorie ?');
    if(isDelete){
      this.categoryService.deleteCategoryById(id).subscribe((res: Category)=>{
        this.alertService.showAlert("Category Deleted with success");
        this.getAllCategories();
       }, error=>{
        this.alertService.showAlert("API error");
       })
    }
  }

  getCategoryNameById(id: number): string | null {
    const parentCategory = this.categoryList.find(category => category.id === id);
    return parentCategory ? parentCategory.name : null;
}


  ngOnInit(): void {
      this.getAllCategories();
  }
}

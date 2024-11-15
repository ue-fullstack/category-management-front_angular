import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../category.service';
import { Category, Page } from '../../../shared/Category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit{

  activateRoute = inject(ActivatedRoute);
  categoryService = inject(CategoryService);

  categoryList: Category[] = [];
  route = inject(Router);

  constructor(){
    this.getAllCategories();
  }

  viewDetails(id: number){
    this.route.navigate(['categorydetail', id]);
  }

  getAllCategories(){
    this.categoryService.getAllCategories().subscribe((res: Page<Category>)=>{
      this.categoryList = res.content;
     }, error=>{
       alert("API error");
     })
  }

  onDelete(id : number){
    const isDelete = confirm('Êtes-vous sûr de voiloir supprimer cette catégorie ?');
    if(isDelete){
      this.categoryService.deleteCategoryById(id).subscribe((res: Category)=>{
        alert("Category Deleted with success");
        this.getAllCategories();
       }, error=>{
        alert("API error");
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

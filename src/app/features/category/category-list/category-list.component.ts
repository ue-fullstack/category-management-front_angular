import { Component, inject, OnInit } from '@angular/core';
import { CategoryServiceService } from '../../../services/category-service.service';
import { Category, Page } from '../../../shared/Category';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit{

  categoryService = inject(CategoryServiceService);
  categoryList: Category[] = [];


  route = inject(Router)


  getAllCategories(){
    this.categoryService.getAllCategories().subscribe((res: Page<Category>)=>{
      this.categoryList = res.content;
     }, error=>{
       alert("API error");
     })
  }

  ngOnInit(): void {
      this.getAllCategories();
  }

  viewDetails(id: number){
    this.route.navigate(['categorydetail', id]);
  }

}

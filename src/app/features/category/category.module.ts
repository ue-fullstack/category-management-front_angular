import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoryListComponent} from "./category-list/category-list.component";
import {CategoryDetailComponent} from "./category-detail/category-detail.component";
import {CreateCategoryComponent} from "./create-category/create-category.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoryDetailComponent,
    CreateCategoryComponent,
    CategoryListComponent
  ]
})
export class CategoryModule { }

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category, Page } from '../../../shared/Category';
import { AlertService } from '../../../services/alert.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, DatePipe,ReactiveFormsModule,RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{
  activateRoute = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  categoryList: Category[] = [];
  route = inject(Router);

  searchForm: FormGroup;
  categories: Category[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  hasSearched = false; // Nouvelle variable

  constructor(private alertService: AlertService, private fb: FormBuilder){
    this.getAllCategories();
    

    this.searchForm = this.fb.group({
      name: [''],
      date: [''],
      parentType: ['']
    });
  }

  

  getAllCategories(){
    this.categoryService.getAllCategories().subscribe((res: Page<Category>)=>{
      this.categoryList = res._embedded.categoryList;
     }, error=>{
      this.alertService.showAlert("API error");
     })
  }


  

  viewDetails(id: number){
    this.route.navigate(['categorydetail', id]);
  }

  ngOnInit(): void {
      this.getAllCategories();
      this.loadCategories();
  }

  loadCategories() {
    const searchParams = {
      name: this.searchForm.get('name')?.value,
      date: this.searchForm.get('date')?.value ? new Date(this.searchForm.get('date')?.value).toISOString().split('T')[0] : null,
      parentType: this.searchForm.get('parentType')?.value,
      page: this.currentPage.toString(),
      size: this.pageSize.toString()
    };

    this.categoryService.searchCategories(searchParams).subscribe(
      (page: Page<Category>) => {
        this.categories = page._embedded.categoryList;
        this.totalElements = page.page.totalElements;
      },
      error => console.error('Error searching categories', error)
    );
  }

  trackByFn(index: number, item: Category) {
    return item.id; // Utilisez l'ID de la catégorie pour le suivi
  }

  onSearch() {
    this.currentPage = 0;
    this.loadCategories();
    this.hasSearched = true; // Marquer qu'une recherche a été effectuée
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCategories();
  }

}


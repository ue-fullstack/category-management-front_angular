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
  route = inject(Router);
  alertService = inject(AlertService); // Injection directe

  searchForm: FormGroup; // Formulaire de recherche
  categoryList: Category[] = []; // Toutes les catégories
  categories: Category[] = []; // Catégories filtrées par recherche
  currentPage = 0; // Page actuelle pour la pagination
  pageSize = 10; // Nombre d'éléments par page
  totalElements = 0; // Nombre total d'éléments disponibles
  hasSearched = false; // Indique si une recherche a été effectuée
  pages: number[] = [];
  activeTab: number = 1;

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire de recherche
    this.searchForm = this.fb.group({
      name: [''],
      isRoot: [''], // Champs pour définir si c'est une catégorie racine
      afterDate: [''], // Date minimale
      beforeDate: [''], // Date maximale
      sortBy: ['name'], // Tri par défaut
      ascending: ['true'], // Ordre ascendant par défaut
    });
  }



  /** Récupère toutes les catégories depuis le service */
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (res: Page<Category>) => {
        this.categoryList = res._embedded.categoryList;
        this.totalElements = res.page.totalElements;
      },
      error => {
        this.alertService.showAlert('Erreur lors de la récupération des catégories.');
      }
    );
  }

  // getRootCategories(): void {
  //   this.categoryService.getRootCategories(this.currentPage, this.pageSize).subscribe(
  //     (res: Page<Category>) => {
  //       this.categoryList = res._embedded.categoryList; // Liste des catégories
  //       this.totalElements = res.page.totalElements; // Total des éléments
  //     },
  //     error => {
  //       this.alertService.showAlert("Erreur lors de la récupération des catégories.");
  //     }
  //   );
  // }


  viewDetails(id: number){
    this.route.navigate(['categorydetail', id]);
  }

  ngOnInit(): void {
    this.getAllCategories()
  }


  /** Chargement des catégories en fonction des critères de recherche */
  loadCategories(): void {
    const searchParams = {
      name: this.searchForm.get('name')?.value || null,
      isRoot: this.searchForm.get('isRoot')?.value || null,
      afterDate: this.searchForm.get('afterDate')?.value
        ? new Date(this.searchForm.get('afterDate')?.value).toISOString()
        : null,
      beforeDate: this.searchForm.get('beforeDate')?.value
        ? new Date(this.searchForm.get('beforeDate')?.value).toISOString()
        : null,
      sortBy: this.searchForm.get('sortBy')?.value || 'name',
      ascending: this.searchForm.get('ascending')?.value === 'true', // Conversion en booléen
      page: this.currentPage.toString(),
      size: this.pageSize.toString(),
    };

    this.categoryService.searchCategories(searchParams).subscribe(
      (res: Page<Category>) => {
        this.categories = res._embedded.categoryList;
        this.totalElements = res.page.totalElements;
        const totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.pages = Array.from({ length: totalPages }, (_, i) => i);
      },
      error => {
        this.alertService.showAlert('Erreur lors de la recherche.');
      }
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
    if (page < 0 || page >= this.pages.length) {
      return; // Empêche de sortir des limites
    }

    this.currentPage = page;
    this.loadCategories(); // Recharge les données pour la nouvelle page
  }



}


import { Routes } from '@angular/router';
import {HomepageComponent} from "./features/home/homepage/homepage.component";
import {CategoryDetailComponent} from "./features/category/category-detail/category-detail.component";
import {CategoryListComponent} from "./features/category/category-list/category-list.component";
import {CreateCategoryComponent} from "./features/category/create-category/create-category.component";
import {AboutComponent} from "./features/about/about/about.component";
import {ContactComponent} from "./features/contact/contact/contact.component";

export const routes: Routes = [
    {
        path: '', //si dans l'url, nous n'avons rien de specific, on le redirige vers login
        redirectTo:'layout',
        pathMatch:'full'
    },
    {
        path:'',
        component:HomepageComponent
    },
    {
        path:'',
        // component:LayoutComponent, //ceci pemettra d'afficher le navbar (menu)
        children: [
            {
                path:'home',
                component:HomepageComponent
            },
            {
                path:'categorydetail',
                component:CategoryDetailComponent
            },
            {
              path:'categorylist',
              component:CategoryListComponent
            },
            {
              path:'createcategory',
              component:CreateCategoryComponent
            },
            {
                path:'about',
                component:AboutComponent
            },
            {
                path:'contact',
                component:ContactComponent
            }
        ]
    }
];

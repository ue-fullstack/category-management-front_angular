import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { CategoryComponent } from './pages/category/category.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AproposComponent } from './apropos/apropos.component';
import { FaqComponent } from './faq/faq.component';
import {HomepageComponent} from "./features/home/homepage/homepage.component";

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
        component:LayoutComponent, //ceci pemettra d'afficher le navbar (menu)
        children: [
            {
                path:'acceuil',
                component:HomepageComponent
            },
            {
                path:'category',
                component:CategoryComponent
            },
            {
                path:'apropos',
                component:AproposComponent
            },
            {
                path:'faq',
                component:FaqComponent
            }
        ]
    }
];

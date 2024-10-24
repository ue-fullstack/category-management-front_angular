import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { CategoryComponent } from './pages/category/category.component';

export const routes: Routes = [
    {
        path: '', //si dans l'url, nous n'avons rien de specific, on le redirige vers login
        redirectTo:'index',
        pathMatch:'full'
    },
    {
        path:'index',
        component:IndexComponent
    },
    {
        path:'',
        component:LayoutComponent, //ceci pemettra d'afficher le navbar (menu)
        children: [
            {
                path:'index',
                component:IndexComponent
            },
            {
                path:'category',
                component:CategoryComponent
            }
        ]
    }
];

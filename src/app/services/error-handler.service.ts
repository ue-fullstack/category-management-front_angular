import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private router: Router) {}

  handleError(error: any) {
    console.error('An error occurred:', error);
    const errorMessage = error.message || 'An unexpected error occurred';
    this.router.navigate(['/404'], { queryParams: { message: errorMessage } });
  }
}

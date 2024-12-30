import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showAlert(message: string): void {
    alert(message);
  }

  showError(error: unknown): void {
    console.error('Error:', error);
  }
}

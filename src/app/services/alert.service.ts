import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private errorHandler: ErrorHandlerService) {}

  showAlert(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.alert(message);
    } else {
      console.log('Alert message:', message);
    }
  }

  showError(error: any) {
    this.errorHandler.handleError(error);
  }
}

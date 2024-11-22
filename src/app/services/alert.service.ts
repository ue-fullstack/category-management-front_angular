import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  showAlert(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.alert(message);
    } else {
      console.log('Alert message:', message);
    }
  }
}
